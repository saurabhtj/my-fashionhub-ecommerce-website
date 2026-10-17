import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getRazorpayClient } from '@/lib/razorpay';
import { getRazorpayOrderFailure } from '@/lib/razorpay-mode.mjs';

const SHIPPING_FEE = 50;
const FREE_SHIPPING_THRESHOLD = 1000;
const BUSINESS_DAYS_TO_DELIVER = 7;
const ADDRESS_TYPES = ['HOME', 'WORK', 'OTHER'] as const;

type DeliveryAddress = {
  houseNumber: string;
  street: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: (typeof ADDRESS_TYPES)[number];
};

function addBusinessDays(start: Date, businessDays: number) {
  const date = new Date(start);
  let addedDays = 0;
  while (addedDays < businessDays) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) addedDays++;
  }
  return date;
}

function isAddress(value: unknown): value is DeliveryAddress {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const address = value as Record<string, unknown>;
  const required = ['houseNumber', 'street', 'area', 'city', 'state', 'pincode', 'country'];
  return (
    required.every((field) =>
      typeof address[field] === 'string' &&
      Boolean((address[field] as string).trim()) &&
      (address[field] as string).trim().length <= 120
    ) &&
    (address.landmark === undefined ||
      (typeof address.landmark === 'string' && address.landmark.trim().length <= 120)) &&
    (typeof address.addressType === 'string' && ADDRESS_TYPES.includes(address.addressType as DeliveryAddress['addressType'])) &&
    /^\d{6}$/.test(address.pincode as string)
  );
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      orders.map((order) => ({
        ...order,
        signature: undefined,
        items: order.items.map(({ cartItemId: _cartItemId, ...item }) => item),
        shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
      }))
    );
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Could not fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body: unknown = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid order details' }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const paymentMethod = input.paymentMethod;
    const customer = input.customer;
    const idempotencyKey = request.headers.get('idempotency-key');
    if (!idempotencyKey || !/^[A-Za-z0-9_-]{16,128}$/.test(idempotencyKey)) {
      return NextResponse.json({ error: 'A valid checkout request key is required' }, { status: 400 });
    }
    if (paymentMethod !== 'COD' && paymentMethod !== 'RAZORPAY') {
      return NextResponse.json({ error: 'Choose a supported payment method' }, { status: 400 });
    }
    if (typeof customer !== 'object' || customer === null || Array.isArray(customer)) {
      return NextResponse.json({ error: 'Customer details are required' }, { status: 400 });
    }

    const customerDetails = customer as Record<string, unknown>;
    const customerName = typeof customerDetails.name === 'string' ? customerDetails.name.trim() : '';
    const customerPhone = typeof customerDetails.phone === 'string' ? customerDetails.phone.replace(/[\s()-]/g, '') : '';
    const customerEmail = typeof customerDetails.email === 'string' ? customerDetails.email.trim().toLowerCase() : '';
    if (!customerName || customerName.length > 100 || !/^\+?\d{10,15}$/.test(customerPhone)) {
      return NextResponse.json({ error: 'Enter a valid full name and mobile number' }, { status: 400 });
    }
    if (customerEmail && (customerEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))) {
      return NextResponse.json({ error: 'Enter a valid email address or leave it blank' }, { status: 400 });
    }

    let deliveryAddress: DeliveryAddress;
    if (typeof input.addressId === 'string' && input.addressId) {
      const saved = await prisma.address.findFirst({
        where: { id: input.addressId, userId: user.id },
      });
      if (!saved) return NextResponse.json({ error: 'Saved address was not found' }, { status: 404 });
      deliveryAddress = {
        houseNumber: saved.houseNumber || saved.address,
        street: saved.street || '',
        area: saved.area || '',
        landmark: saved.landmark || '',
        city: saved.city,
        state: saved.state || '',
        pincode: saved.pincode,
        country: saved.country,
        addressType: ADDRESS_TYPES.includes(saved.addressType as DeliveryAddress['addressType'])
          ? (saved.addressType as DeliveryAddress['addressType'])
          : 'HOME',
      };
    } else if (isAddress(input.address)) {
      deliveryAddress = {
        ...input.address,
        landmark: input.address.landmark || '',
      };
    } else {
      return NextResponse.json({ error: 'Complete all required delivery address fields' }, { status: 400 });
    }

    let razorpayConfig: ReturnType<typeof getRazorpayClient> | null = null;
    if (paymentMethod === 'RAZORPAY') {
      try {
        razorpayConfig = getRazorpayClient();
      } catch (error) {
        console.error('Razorpay test mode configuration is invalid:', error);
        return NextResponse.json({
          error: 'Razorpay Test Mode is not configured correctly. Set a test key ID, matching test secret, and RAZORPAY_MODE=test.',
        }, { status: 503 });
      }
    }

    const previousOrder = await prisma.order.findUnique({
      where: { userId_idempotencyKey: { userId: user.id, idempotencyKey } },
      include: { items: true },
    });
    if (previousOrder) {
      if (previousOrder.paymentMethod !== paymentMethod) {
        return NextResponse.json({ error: 'This checkout request key was already used with a different payment method.' }, { status: 409 });
      }
      if (previousOrder.paymentMethod === 'RAZORPAY' && !previousOrder.razorpayOrderId) {
        return NextResponse.json({ error: 'The previous payment attempt could not be initialized. Start a new attempt.' }, { status: 409 });
      }
      return NextResponse.json({
        orderId: previousOrder.id,
        createdAt: previousOrder.createdAt,
        amount: previousOrder.amount,
        amountPaise: Math.round(previousOrder.amount * 100),
        subtotal: previousOrder.subtotal,
        shippingFee: previousOrder.shippingFee,
        expectedDelivery: previousOrder.expectedDelivery,
        paymentMethod: previousOrder.paymentMethod,
        customer: {
          name: previousOrder.customerName,
          phone: previousOrder.customerPhone,
          email: previousOrder.customerEmail,
        },
        deliveryAddress: previousOrder.shippingAddress ? JSON.parse(previousOrder.shippingAddress) : null,
        items: previousOrder.items.map(({ cartItemId: _cartItemId, ...item }) => item),
        razorpayOrder: previousOrder.razorpayOrderId
          ? { id: previousOrder.razorpayOrderId, amount: Math.round(previousOrder.amount * 100), currency: previousOrder.currency }
          : null,
        razorpayKeyId: razorpayConfig?.keyId ?? null,
        razorpayMode: razorpayConfig?.mode ?? null,
      });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });
    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }
    if (cartItems.some((item) =>
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      !Number.isFinite(item.product.price) ||
      item.product.price <= 0 ||
      item.product.isArchived ||
      item.quantity > item.product.stock
    )) {
      return NextResponse.json({ error: 'One or more items are no longer available in the requested quantity' }, { status: 409 });
    }

    const subtotalPaise = cartItems.reduce(
      (sum, item) => sum + Math.round(item.product.price * 100) * item.quantity,
      0
    );
    const subtotal = subtotalPaise / 100;
    const shippingFee = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const amountPaise = subtotalPaise + shippingFee * 100;
    if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
      return NextResponse.json({ error: 'The order total is invalid. Please review your cart.' }, { status: 422 });
    }
    const amount = amountPaise / 100;
    const now = new Date();
    const expectedDelivery = addBusinessDays(now, BUSINESS_DAYS_TO_DELIVER);
    const addressSnapshot = JSON.stringify(deliveryAddress);

    const order = await prisma.$transaction(async (transaction) => {
      const createdOrder = await transaction.order.create({
        data: {
          userId: user.id,
          idempotencyKey,
          amount,
          subtotal,
          shippingFee,
          currency: 'INR',
          status: paymentMethod === 'COD' ? 'CONFIRMED' : 'AWAITING_PAYMENT',
          paymentStatus: paymentMethod === 'COD' ? 'UNPAID' : 'PENDING',
          paymentMethod,
          deliveryStatus: paymentMethod === 'COD' ? 'PROCESSING' : 'AWAITING_PAYMENT',
          expectedDelivery,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          shippingAddress: addressSnapshot,
          items: {
            create: cartItems.map((item) => ({
              cartItemId: item.id,
              productName: item.product.name,
              image: item.product.image,
              unitPrice: item.product.price,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            })),
          },
        },
        include: { items: true },
      });

      if (paymentMethod === 'COD') {
        await transaction.cartItem.deleteMany({
          where: { userId: user.id, id: { in: cartItems.map((item) => item.id) } },
        });
      }

      return createdOrder;
    });

    let razorpayOrder: { id: string; amount: number; currency: string } | null = null;
    let razorpayKeyId: string | null = null;
    let razorpayMode: string | null = null;
    if (paymentMethod === 'RAZORPAY') {
      try {
        if (!razorpayConfig) throw new Error('Razorpay test configuration was not initialized');
        razorpayKeyId = razorpayConfig.keyId;
        razorpayMode = razorpayConfig.mode;
        const createdRazorpayOrder = await razorpayConfig.client.orders.create({
          amount: amountPaise,
          currency: 'INR',
          receipt: order.id.slice(0, 40),
          notes: { internalOrderId: order.id },
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { razorpayOrderId: createdRazorpayOrder.id },
        });
        razorpayOrder = {
          id: createdRazorpayOrder.id,
          amount: Number(createdRazorpayOrder.amount),
          currency: createdRazorpayOrder.currency,
        };
      } catch (error) {
        const failure = getRazorpayOrderFailure(error);
        console.error('Razorpay order initialization failed:', {
          statusCode: failure.statusCode,
          code: failure.code,
          description: failure.description,
        });
        await prisma.order.delete({ where: { id: order.id } });
        return NextResponse.json({
          error: failure.message,
        }, { status: 502 });
      }
    }

    return NextResponse.json({
      orderId: order.id,
      createdAt: order.createdAt,
      amount,
      amountPaise,
      subtotal,
      shippingFee,
      expectedDelivery,
      paymentMethod,
      customer: { name: customerName, phone: customerPhone, email: customerEmail || null },
      deliveryAddress,
      items: order.items.map(({ cartItemId: _cartItemId, ...item }) => item),
      razorpayOrder,
      razorpayKeyId,
      razorpayMode,
    }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Could not place your order. Please try again.' }, { status: 500 });
  }
}
