import { createRequire } from "node:module";
import { PrismaClient } from "@prisma/client";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());

const email = process.argv[2]?.trim().toLowerCase();
if (process.env.CONFIRM_ADMIN_PROMOTION !== "YES") {
  throw new Error("Set CONFIRM_ADMIN_PROMOTION=YES to confirm this privileged action.");
}
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error("Pass the existing account email: npm run admin:promote -- admin@example.com");
}

const prisma = new PrismaClient();
try {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } });
  if (!user) throw new Error("No existing account was found for that email.");
  await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  console.log(`Administrator access granted to ${email}.`);
} finally {
  await prisma.$disconnect();
}
