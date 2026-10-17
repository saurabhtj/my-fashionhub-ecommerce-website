import assert from 'node:assert/strict';
import test from 'node:test';
import {
  checkoutSignature,
  isValidHexSignature,
  webhookSignature,
} from '../src/lib/razorpay-signatures.mjs';
import {
  getRazorpayOrderFailure,
  resolveRazorpayMode,
} from '../src/lib/razorpay-mode.mjs';

test('checkout signature verifies only the matching Razorpay order and payment', () => {
  const signature = checkoutSignature('order_123', 'pay_456', 'test-secret');

  assert.equal(isValidHexSignature(signature.toString('hex'), signature), true);
  assert.equal(isValidHexSignature(signature.toString('hex').toUpperCase(), signature), true);
  assert.equal(isValidHexSignature('0'.repeat(64), signature), false);
  assert.equal(isValidHexSignature('not-a-signature', signature), false);
  assert.equal(isValidHexSignature(`${signature.toString('hex')}00`, signature), false);
});

test('webhook signatures depend on the exact raw request body', () => {
  const body = '{"event":"payment.captured","payload":{}}';
  const signature = webhookSignature(body, 'webhook-secret');

  assert.equal(isValidHexSignature(signature.toString('hex'), signature), true);
  assert.equal(
    isValidHexSignature(webhookSignature(`${body} `, 'webhook-secret').toString('hex'), signature),
    false
  );
});

test('Razorpay mode defaults to test and rejects live keys in test mode', () => {
  assert.equal(resolveRazorpayMode(undefined, 'rzp_test_123'), 'test');
  assert.equal(resolveRazorpayMode('test', 'rzp_test_123'), 'test');
  assert.throws(() => resolveRazorpayMode('test', 'rzp_live_123'), /requires a key ID/);
  assert.throws(() => resolveRazorpayMode('live', 'rzp_live_123'), /restricted to Razorpay Test Mode/);
  assert.throws(() => resolveRazorpayMode('production', 'rzp_test_123'), /restricted to Razorpay Test Mode/);
});

test('Razorpay authentication failure explains the test credential fix without leaking other fields', () => {
  assert.deepEqual(
    getRazorpayOrderFailure({
      statusCode: 401,
      error: { code: 'BAD_REQUEST_ERROR', description: 'Authentication failed' },
      key_secret: 'must-not-be-returned',
    }),
    {
      statusCode: 401,
      code: 'BAD_REQUEST_ERROR',
      description: 'Authentication failed',
      message: 'Razorpay rejected the Test Mode credentials. Use the Key ID and Key Secret from the same Razorpay Test Mode account, update .env, and restart the development server.',
    }
  );
});
