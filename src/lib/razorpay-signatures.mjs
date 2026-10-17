import { createHmac, timingSafeEqual } from 'node:crypto';

export function isValidHexSignature(received, expected) {
  if (typeof received !== 'string' || !/^[a-f\d]{64}$/i.test(received)) return false;
  const signature = Buffer.from(received, 'hex');
  return signature.length === expected.length && timingSafeEqual(signature, expected);
}

export function checkoutSignature(orderId, paymentId, secret) {
  return createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest();
}

export function webhookSignature(rawBody, secret) {
  return createHmac('sha256', secret).update(rawBody).digest();
}
