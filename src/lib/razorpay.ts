import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { resolveRazorpayMode } from '@/lib/razorpay-mode.mjs';

export { checkoutSignature, isValidHexSignature, webhookSignature } from '@/lib/razorpay-signatures.mjs';

export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('Razorpay server credentials are not configured');
  const mode = resolveRazorpayMode(process.env.RAZORPAY_MODE, keyId);
  return { client: new Razorpay({ key_id: keyId, key_secret: keySecret }), keyId, mode };
}

export async function markOrderPaid(input: {
  orderId: string;
  paymentId: string;
  signature?: string;
  signatureVerified: boolean;
}) {
  return prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findUnique({
      where: { id: input.orderId },
      include: { items: true },
    });
    if (!order || order.paymentMethod !== 'RAZORPAY') return false;
    if (order.paymentStatus === 'PAID') {
      if (order.paymentId !== input.paymentId) return false;
      if (input.signatureVerified && !order.paymentSignatureVerified) {
        await transaction.order.update({
          where: { id: order.id },
          data: { signature: input.signature ?? null, paymentSignatureVerified: true },
        });
      }
      return true;
    }
    if (!['PENDING', 'FAILED'].includes(order.paymentStatus)) return false;

    const updated = await transaction.order.updateMany({
      where: {
        id: order.id,
        paymentMethod: 'RAZORPAY',
        paymentStatus: { in: ['PENDING', 'FAILED'] },
      },
      data: {
        status: 'PAID',
        paymentStatus: 'PAID',
        deliveryStatus: 'PROCESSING',
        paymentId: input.paymentId,
        signature: input.signature ?? null,
        paymentSignatureVerified: input.signatureVerified,
      },
    });
    if (updated.count !== 1) {
      const latest = await transaction.order.findUnique({ where: { id: order.id } });
      return latest?.paymentStatus === 'PAID' && latest.paymentId === input.paymentId;
    }

    for (const item of order.items) {
      if (item.cartItemId) {
        await transaction.cartItem.deleteMany({
          where: { id: item.cartItemId, userId: order.userId, quantity: item.quantity },
        });
      }
    }
    return true;
  });
}
