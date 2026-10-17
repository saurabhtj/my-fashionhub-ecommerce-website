import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  checkoutSignature,
  getRazorpayClient,
  isValidHexSignature,
  markOrderPaid,
} from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: unknown = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid payment details' }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body as Record<string, unknown>;
    if (
      typeof razorpay_order_id !== 'string' || !/^order_[A-Za-z0-9]+$/.test(razorpay_order_id) ||
      typeof razorpay_payment_id !== 'string' || !/^pay_[A-Za-z0-9]+$/.test(razorpay_payment_id) ||
      typeof razorpay_signature !== 'string' || !/^[a-f\d]{64}$/i.test(razorpay_signature)
    ) {
      return NextResponse.json({ error: 'Incomplete or invalid payment details' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const order = await prisma.order.findFirst({
      where: { razorpayOrderId: razorpay_order_id, userId: user.id, paymentMethod: 'RAZORPAY' },
      select: {
        id: true,
        amount: true,
        currency: true,
        paymentStatus: true,
        paymentId: true,
      },
    });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || !process.env.RAZORPAY_KEY_ID) {
      console.error('Razorpay payment verification is not configured');
      return NextResponse.json({ error: 'Payment verification is not configured' }, { status: 503 });
    }

    const expectedSignature = checkoutSignature(razorpay_order_id, razorpay_payment_id, secret);
    if (!isValidHexSignature(razorpay_signature, expectedSignature)) {
      return NextResponse.json({ error: 'Payment signature could not be verified' }, { status: 400 });
    }

    const { client } = getRazorpayClient();
    let payment;
    try {
      payment = await client.payments.fetch(razorpay_payment_id);
    } catch (error) {
      console.error('Razorpay payment lookup failed:', error);
      return NextResponse.json({ error: 'Payment status is temporarily unavailable. Retry verification shortly.' }, { status: 502 });
    }

    if (
      payment.order_id !== razorpay_order_id ||
      Number(payment.amount) !== Math.round(order.amount * 100) ||
      payment.currency !== order.currency
    ) {
      return NextResponse.json({ error: 'Payment details do not match this order' }, { status: 409 });
    }

    if (payment.status !== 'captured' || payment.captured !== true) {
      if (payment.status === 'authorized') {
        return NextResponse.json({
          success: false,
          pending: true,
          orderId: order.id,
          paymentStatus: 'PENDING',
          message: 'Payment is authorized and awaiting capture confirmation.',
        }, { status: 202 });
      }
      if (payment.status === 'failed') {
        await prisma.order.updateMany({
          where: { id: order.id, paymentStatus: { in: ['PENDING', 'FAILED'] } },
          data: { status: 'FAILED', paymentStatus: 'FAILED' },
        });
        return NextResponse.json({
          success: false,
          orderId: order.id,
          paymentStatus: 'FAILED',
          message: 'Payment failed. You can safely retry checkout.',
        });
      }
      return NextResponse.json({ error: 'Razorpay has not confirmed a successful captured payment' }, { status: 409 });
    }

    const confirmed = await markOrderPaid({
      orderId: order.id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      signatureVerified: true,
    });
    if (!confirmed) {
      return NextResponse.json({ error: 'The order could not be confirmed for this payment' }, { status: 409 });
    }

    return NextResponse.json({ success: true, orderId: order.id, paymentStatus: 'PAID' });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 });
  }
}
