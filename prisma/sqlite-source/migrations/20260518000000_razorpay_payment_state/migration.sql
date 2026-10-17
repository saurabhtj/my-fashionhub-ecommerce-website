ALTER TABLE "Order" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'INR';
ALTER TABLE "Order" ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Order" ADD COLUMN "paymentSignatureVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Order" ADD COLUMN "idempotencyKey" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "cartItemId" TEXT;

UPDATE "Order"
SET "paymentStatus" = CASE
  WHEN "paymentMethod" = 'COD' THEN 'UNPAID'
  WHEN "status" = 'PAID' THEN 'PAID'
  WHEN "status" = 'FAILED' THEN 'FAILED'
  ELSE 'PENDING'
END;

CREATE TABLE "PaymentWebhookEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "eventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "orderId" TEXT,
  "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaymentWebhookEvent_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "PaymentWebhookEvent_eventId_key" ON "PaymentWebhookEvent"("eventId");
CREATE UNIQUE INDEX "Order_userId_idempotencyKey_key" ON "Order"("userId", "idempotencyKey");
