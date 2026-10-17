# Admin dashboard and launch status

## Current implementation

The admin dashboard is implemented in the existing Next.js + Prisma application. PostgreSQL is the active Prisma schema; the existing SQLite file and migration history are retained under `prisma/sqlite-source/` as the source for a one-time data copy. The dashboard provides:

- Database-backed order, captured-payment, pending-payment, and captured-sales totals.
- Paginated order lookup by internal order ID, customer details, item quantities, payment references, signature-verification state, and fulfilment status updates.
- Paginated product search, product creation, price/stock editing, and reversible archiving.
- A `/api/health` endpoint that checks database connectivity.
- Server-side admin authorization that reloads the account role from the database for every admin page/API request. There is no public admin registration.

Only the existing storefront product IDs and newly created products are exposed in the public catalog. The 12 legacy numeric-ID seed products remain in the database and are not deleted or exposed as new shop listings. Archiving a storefront product hides it from the shop/search and prevents new cart/order creation; existing orders and wishlist records are retained.

## Local setup

Use the existing `.env` file (do not commit it). Required values for the local application include:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
SQLITE_SOURCE_URL="file:../dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="use-a-long-random-secret"
RAZORPAY_KEY_ID="rzp_test_replace_me"
RAZORPAY_KEY_SECRET="replace-with-test-secret"
RAZORPAY_WEBHOOK_SECRET="replace-with-a-distinct-webhook-secret"
RAZORPAY_MODE="test"
```

Back up `prisma/dev.db`, stop the running Next.js server, and initialize PostgreSQL and copy the existing SQLite data before restarting the app:

```powershell
npx prisma migrate deploy
npm run db:migrate:sqlite-to-postgres
npm run dev
```

The copy command generates both Prisma clients and only imports into an empty PostgreSQL database. It preserves IDs and timestamps and validates source/target row counts inside a transaction. Keep the SQLite file as a backup until the PostgreSQL copy has been checked. The health endpoint is `http://localhost:3000/api/health`.

## Granting the first administrator

Register or use an existing customer account first. Promote that account from a trusted local shell; this is not exposed as a website route:

```powershell
$env:CONFIRM_ADMIN_PROMOTION = "YES"
npm run admin:promote -- existing-account@example.com
Remove-Item Env:CONFIRM_ADMIN_PROMOTION
```

The command only changes the `role` of an existing account; the account keeps its existing bcrypt-hashed password. Sign in with that account and open `/admin`. Public registration continues to create ordinary `USER` accounts.

## Product and inventory behavior

Admin changes are sourced from the database in the storefront product detail, catalog, and search APIs. Stock is checked when a customer adds or updates a cart item and again when an order is created. At present, creating an order does not decrement or reserve stock; admins must maintain counts manually, and simultaneous checkouts can oversell. Implement transactional stock reservation/decrement, safe release on failed/cancelled orders, and expiry before public sales rely on inventory counts.

The existing schema stores prices as floating-point values; the PostgreSQL schema preserves that representation and checkout calculations round to paise. A separate fixed-precision monetary migration should be planned and tested independently.

## Razorpay test mode

Keep `RAZORPAY_MODE="test"` and use Razorpay Test Mode credentials. Configure the test webhook endpoint as:

```text
https://<deployed-backend-host>/api/payments/webhook
```

Use the same webhook secret in the Razorpay dashboard and `RAZORPAY_WEBHOOK_SECRET`. Subscribe to the payment capture/failure, order paid, and refund events supported by the current webhook handler. Keep the Key Secret and webhook secret only in server-side environment configuration. Do not switch to live credentials until production database, TLS, backups, webhook delivery, and payment reconciliation have been verified.

## Deployment

Render/Netlify deployment preparation and manual dashboard steps are documented in [deployment.md](./deployment.md). Render Free Postgres is suitable only for temporary previews; it expires after 30 days and its data is deleted after the additional grace period unless upgraded. Do not use that plan for real orders or payments.

## Verification status

Run the following after migration and before release:

```powershell
npx prisma migrate status
npx tsc --noEmit
npm run test:payments
npm run build
```

Test that unauthenticated admin API calls return 401, ordinary users receive 403, and a promoted account can view/update data. Test product create/edit/archive and stock zero/cart/order rejection. Test captured and failed Razorpay test payments, signature mismatch, amount mismatch, duplicate webhook delivery, refund reconciliation, and database persistence. Do not use live payment credentials for these checks.
