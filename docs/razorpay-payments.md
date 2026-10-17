# Razorpay payments

## Payment lifecycle

The authenticated checkout sends only customer, address, and payment-method data to `POST /api/orders`. The server loads the signed-in user's cart and database product prices, calculates the INR total in paise, snapshots the order and cart item IDs, then creates the Razorpay order. The response exposes only the Razorpay public key, order ID, amount, and checkout details. An `Idempotency-Key` prevents duplicate orders on retried checkout requests.

After Checkout.js returns its payment ID, order ID, and signature, `POST /api/verify-payment` checks that the order belongs to the signed-in user, verifies the checkout HMAC with a constant-time comparison, and fetches the payment from Razorpay. The server checks the Razorpay order ID, captured status, exact amount, and currency before atomically marking the order paid. Repeated verification for the same payment is safe. The cart rows included in that order are removed only if they have not since been changed.

`POST /api/payments/webhook` validates `X-Razorpay-Signature` against the exact raw request body. It reconciles `payment.captured`, `payment.failed`, `order.paid`, `payment.refunded`, and `refund.processed` events. Razorpay's `X-Razorpay-Event-Id` is stored with a unique constraint so webhook retries are idempotent. A browser callback alone never confirms payment. COD remains separate and is recorded as unpaid until collection.

Payment state is persisted separately from delivery/order status: `Order.paymentStatus` is `PENDING`, `PAID`, `FAILED`, `UNPAID`, `PARTIALLY_REFUNDED`, or `REFUNDED`; `Order.status` continues to represent the order lifecycle. Refund events only update the matching payment recorded on the order; they do not undo the delivery state.

## Configuration

Copy `.env.example` to `.env` and populate the values from the Razorpay Dashboard. This checkout is hard-restricted to Test Mode: it requires `RAZORPAY_MODE=test` and a key ID beginning `rzp_test_`, and rejects live keys or any other mode. Never commit `.env`, publish the key secret, or use the webhook secret as the API key secret. `RAZORPAY_KEY_ID` is the only Razorpay credential returned to checkout. For this testing setup, keep `RAZORPAY_MODE=test` and use test-mode credentials only.

To get test credentials, sign in to the Razorpay Dashboard, switch to **Test Mode**, then find the API keys under **Account & Settings → Website and app settings → API Keys** (menu labels may change). Generate a test key pair and set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. The key ID must be a test key (`rzp_test_...`) in test mode.

Configure a webhook in the Razorpay Dashboard in the same mode as the API keys:

- URL: `https://<your-host>/api/payments/webhook`
- Secret: create a strong, unique secret and set the exact value as `RAZORPAY_WEBHOOK_SECRET`.
- Subscribe to `payment.captured`, `payment.failed`, `order.paid`, and `refund.processed` if refunds are managed in the Razorpay Dashboard.

Webhook delivery requires a publicly reachable HTTPS URL; localhost cannot receive Razorpay webhook delivery directly. Use a public staging host for webhook testing. If the webhook secret is not configured, the webhook endpoint fails closed with HTTP 503.

Reference: [Razorpay Standard Checkout integration steps](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/) and [Razorpay webhook signature validation and retries](https://razorpay.com/docs/webhooks/validate-test/).

## Database

This repository previously had no Prisma migration history. A baseline migration records the existing SQLite schema; existing databases must be baselined before applying the payment-state migration. Back up the database before changing a production database.

For a fresh database, run:

```powershell
npx prisma migrate deploy
npx prisma generate
```

For an existing database that already has the pre-payment application schema, first mark the baseline migration as applied (this records the existing schema; it does not change data), then apply the new additive payment migration:

```powershell
npx prisma migrate resolve --applied 20260517000000_baseline
npx prisma migrate deploy
npx prisma generate
```

Do not mark the payment-state migration as applied without applying its SQL. Verify the migration status and back up the production database before deployment.

## Local test flow

1. Configure test API keys in `.env`, then start the app with `npm run dev`.
2. Sign in, add an in-stock item to the cart, and submit checkout with Razorpay selected.
3. Complete the payment using a test payment method from Razorpay's current test documentation. The order should appear as paid only after server verification.
4. In test mode, also test a failed attempt, closing the Checkout modal, and retrying. Failed/closed attempts must not show the success confirmation.
5. Test signature rejection by changing a callback signature in a non-production test request; test authorization by attempting to verify an order belonging to another signed-in user.
6. Test webhook replay by redelivering the same signed event: the endpoint should acknowledge it without repeating the order/cart transition. Use the exact configured webhook secret and raw event body.
7. Test verification network failure after a successful Checkout response: use **Retry payment verification**; do not initiate a second charge while the payment is pending.

Run the payment-signature regression tests with `npm run test:payments`.

The integration does not store card numbers or CVVs. Refunds are not initiated by this checkout; reconcile refunds separately before adding refund actions to order status.

## Production deployment

This checkout is currently restricted to Test Mode. Do not deploy for live transactions until the payment owner explicitly requests live support and the mode guard and UI are deliberately updated. Never expose secrets in client-side `NEXT_PUBLIC_*` variables or logs.
