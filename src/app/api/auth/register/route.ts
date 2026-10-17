
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse as Response } from "next/server";

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  const { email, name, password } = body as Record<string, unknown>;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    (name !== undefined && typeof name !== "string")
  ) {
    return Response.json({ message: "Email and password are required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = typeof name === "string"
    ? name.trim()
    : normalizedEmail.split("@")[0];

  if (
    !normalizedName ||
    normalizedName.length > 100 ||
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    return Response.json({ message: "Please provide a valid email address" }, { status: 400 });
  }

  if (password.length < 6) {
    return Response.json({ message: "Password must be at least 6 characters" }, { status: 400 });
  }

  try {
    const exists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (exists) {
      return Response.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: normalizedName,
        password: hashedPassword,
      },
    });

    return Response.json(
      { message: "User created successfully", user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ message: "User already exists" }, { status: 409 });
    }

    console.error("Registration error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
