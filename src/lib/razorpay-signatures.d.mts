export function isValidHexSignature(received: unknown, expected: Buffer): boolean;
export function checkoutSignature(orderId: string, paymentId: string, secret: string): Buffer;
export function webhookSignature(rawBody: string | Uint8Array, secret: string): Buffer;
