import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  getRazorpayClient,
  isValidHexSignature,
  webhookSignature,
} from '@/lib/razorpay';

export const runtime = 'nodejs';

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Razorpay webhook secret is not configured');
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 503 });
  }

  const eventId = request.headers.get('x-razorpay-event-id');
  const signature = request.headers.get('x-razorpay-signature');
  if (!eventId || eventId.length > 200 || !signature) {
    return NextResponse.json({ error: 'Missing webhook event identity or signature' }, { status: 400 });
  }

  const rawBody = Buffer.from(await request.arrayBuffer());
  if (rawBody.byteLength > 1_000_000) {
    return NextResponse.json({ error: 'Webhook payload is too large' }, { status: 413 });
  }
  if (!isValidHexSignature(signature, webhookSignature(rawBody, webhookSecret))) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
  }
  const body = asRecord(payload);
  const eventType = body?.event;
  const eventPayload = asRecord(body?.payload);
  if (!body || typeof eventType !== 'string' || !eventPayload) {
    return NextResponse.json({ error: 'Invalid webhook event' }, { status: 400 });
  }

  let paymentEntity = asRecord(asRecord(eventPayload.payment)?.entity);
  const orderEntity = asRecord(asRecord(eventPayload.order)?.entity);
  let paymentId = typeof paymentEntity?.id === 'string' ? paymentEntity.id : '';
  let razorpayOrderId = typeof paymentEntity?.order_id === 'string' ? paymentEntity.order_id : '';

  if (eventType === 'order.paid' && !paymentId && typeof orderEntity?.id === 'string') {
    try {
      const { client } = getRazorpayClient();
      const payments = await client.orders.fetchPayments(orderEntity.id);
      const capturedPayment = payments.items.find((item) =>
        item.status === 'captured' && item.order_id === orderEntity?.id
      );
      if (capturedPayment) {
        paymentEntity = {
          id: capturedPayment.id,
          order_id: capturedPayment.order_id,
          status: capturedPayment.status,
          amount: capturedPayment.amount,
          currency: capturedPayment.currency,
        };
        paymentId = capturedPayment.id;
        razorpayOrderId = capturedPayment.order_id;
      } else {
        return NextResponse.json({ error: 'Captured payment is not yet available for this order' }, { status: 502 });
      }
    } catch (error) {
      console.error('Razorpay order payment lookup failed:', error);
      return NextResponse.json({ error: 'Could not reconcile paid order' }, { status: 502 });
    }
  }

  if (eventType === 'refund.processed' && !paymentId) {
    const refundEntity = asRecord(asRecord(eventPayload.refund)?.entity);
    if (typeof refundEntity?.payment_id === 'string') {
      try {
        const { client } = getRazorpayClient();
        const payment = await client.payments.fetch(refundEntity.payment_id);
        paymentEntity = {
          id: payment.id,
          order_id: payment.order_id,
          status: payment.status,
          amount: payment.amount,
          amount_refunded: payment.amount_refunded,
          currency: payment.currency,
        };
        paymentId = payment.id;
        razorpayOrderId = payment.order_id;
      } catch (error) {
        console.error('Razorpay refund payment lookup failed:', error);
        return NextResponse.json({ error: 'Could not reconcile refund' }, { status: 502 });
      }
    }
  }

  const internalOrder = razorpayOrderId
    ? await prisma.order.findUnique({ where: { razorpayOrderId } })
    : null;

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.paymentWebhookEvent.create({
        data: {
          eventId,
          eventType,
          orderId: internalOrder?.id ?? null,
        },
      });

      if (!internalOrder || internalOrder.paymentMethod !== 'RAZORPAY') return;

      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        if (
          !paymentEntity ||
          !paymentId ||
          paymentEntity.status !== 'captured' ||
          paymentEntity.order_id !== internalOrder.razorpayOrderId ||
          Number(paymentEntity.amount) !== Math.round(internalOrder.amount * 100) ||
          paymentEntity.currency !== internalOrder.currency
        ) return;

        const paid = await transaction.order.updateMany({
          where: {
            id: internalOrder.id,
            paymentMethod: 'RAZORPAY',
            paymentStatus: { in: ['PENDING', 'FAILED'] },
          },
          data: {
            status: 'PAID',
            paymentStatus: 'PAID',
            deliveryStatus: 'PROCESSING',
            paymentId,
            paymentSignatureVerified: false,
          },
        });
        if (paid.count === 1) {
          const items = await transaction.orderItem.findMany({
            where: { orderId: internalOrder.id, cartItemId: { not: null } },
            select: { cartItemId: true, quantity: true },
          });
          for (const item of items) {
            if (item.cartItemId) {
              await transaction.cartItem.deleteMany({
                where: {
                  id: item.cartItemId,
                  userId: internalOrder.userId,
                  quantity: item.quantity,
                },
              });
            }
          }
        }
      } else if (eventType === 'payment.failed' && paymentEntity?.order_id === internalOrder.razorpayOrderId) {
        if (
          paymentEntity.amount !== undefined &&
          Number(paymentEntity.amount) !== Math.round(internalOrder.amount * 100)
        ) return;
        if (paymentEntity.currency !== undefined && paymentEntity.currency !== internalOrder.currency) return;
        await transaction.order.updateMany({
          where: { id: internalOrder.id, paymentStatus: { in: ['PENDING', 'FAILED'] } },
          data: { status: 'FAILED', paymentStatus: 'FAILED' },
        });
      } else if (eventType === 'payment.refunded' || eventType === 'refund.processed') {
        const refundEntity = asRecord(asRecord(eventPayload.refund)?.entity);
        const refundedPaymentId = eventType === 'refund.processed'
          ? refundEntity?.payment_id
          : paymentEntity?.id;
        if (typeof refundedPaymentId !== 'string' || internalOrder.paymentId !== refundedPaymentId) return;

        const paymentAmountRefunded = Number(paymentEntity?.amount_refunded);
        const paymentAmount = Number(paymentEntity?.amount);
        const paymentCurrency = paymentEntity?.currency;
        if (
          !Number.isFinite(paymentAmountRefunded) ||
          (Number.isFinite(paymentAmount) && paymentAmount !== Math.round(internalOrder.amount * 100)) ||
          (typeof paymentCurrency === 'string' && paymentCurrency !== internalOrder.currency)
        ) return;

        const paymentStatus = paymentAmountRefunded >= Math.round(internalOrder.amount * 100)
          ? 'REFUNDED'
          : paymentAmountRefunded > 0
            ? 'PARTIALLY_REFUNDED'
            : null;
        if (paymentStatus) {
          await transaction.order.updateMany({
            where: {
              id: internalOrder.id,
              paymentId: refundedPaymentId,
              paymentStatus: { in: ['PAID', 'PARTIALLY_REFUNDED'] },
            },
            data: { paymentStatus },
          });
        }
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error('Razorpay webhook processing failed:', error);
    return NextResponse.json({ error: 'Could not process webhook event' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
