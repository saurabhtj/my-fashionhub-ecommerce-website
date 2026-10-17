import { createRequire } from "node:module";
import { PrismaClient as PostgresClient } from "@prisma/client";
import { PrismaClient as SqliteClient } from "../node_modules/.prisma/sqlite-client/index.js";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());

const sqliteUrl = process.env.SQLITE_SOURCE_URL;
const postgresUrl = process.env.DATABASE_URL;

if (!sqliteUrl?.startsWith("file:")) {
  throw new Error("SQLITE_SOURCE_URL must point to the existing SQLite file.");
}
if (!postgresUrl || !/^postgres(ql)?:\/\//.test(postgresUrl)) {
  throw new Error("DATABASE_URL must be a PostgreSQL connection string.");
}

const source = new SqliteClient();
const target = new PostgresClient();
const modelNames = [
  "user",
  "product",
  "account",
  "session",
  "verificationToken",
  "address",
  "cartItem",
  "order",
  "orderItem",
  "paymentWebhookEvent",
  "wishlist",
];

const readSource = async () =>
  Object.fromEntries(
    await Promise.all(modelNames.map(async (name) => [name, await source[name].findMany()])),
  );

const countRows = async (client) =>
  Object.fromEntries(
    await Promise.all(modelNames.map(async (name) => [name, await client[name].count()])),
  );

const main = async () => {
  try {
    const rows = await readSource();
    const sourceCounts = Object.fromEntries(
      Object.entries(rows).map(([name, records]) => [name, records.length]),
    );
    await target.$transaction(
      async (transaction) => {
        const targetCounts = await countRows(transaction);
        const populatedModels = Object.entries(targetCounts)
          .filter(([, count]) => count > 0)
          .map(([name]) => name);
        if (populatedModels.length > 0) {
          throw new Error(
            `PostgreSQL target must be empty. Existing data found in: ${populatedModels.join(", ")}.`,
          );
        }

        for (const name of modelNames) {
          const records = rows[name];
          for (let offset = 0; offset < records.length; offset += 500) {
            await transaction[name].createMany({
              data: records.slice(offset, offset + 500),
            });
          }
        }

        const importedCounts = await countRows(transaction);
        const mismatches = modelNames.filter(
          (name) => importedCounts[name] !== sourceCounts[name],
        );
        if (mismatches.length > 0) {
          throw new Error(`Post-migration row counts differ for: ${mismatches.join(", ")}.`);
        }
      },
      { maxWait: 10_000, timeout: 120_000 },
    );

    console.log("SQLite data copied to PostgreSQL; all application table counts match.");
    for (const name of modelNames) {
      console.log(`${name}: ${sourceCounts[name]}`);
    }
  } finally {
    await Promise.all([source.$disconnect(), target.$disconnect()]);
  }
};

await main();
