import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

import { allProducts } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = cartItems.map(item => {
      const staticProd = allProducts.find(p => p.id === item.productId);
      const originalPrice = staticProd?.originalPrice || (item.product.price < 1000 ? Math.round(item.product.price * 1.25) : Math.round(item.product.price * 1.2));
      return {
        ...item,
        product: {
          ...item.product,
          originalPrice: originalPrice > item.product.price ? originalPrice : undefined,
          tag: staticProd?.tag,
          isSale: staticProd?.isSale,
          isNew: staticProd?.isNew,
          description: staticProd?.description,
          stock: item.product.isArchived ? 0 : item.product.stock,
          isArchived: item.product.isArchived,
        }
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid cart item' }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const { productId, size, color } = input;
    const quantity = input.quantity ?? 1;

    if (typeof productId !== 'string' || !productId || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    if ((size !== undefined && size !== null && typeof size !== 'string') || (color !== undefined && color !== null && typeof color !== 'string')) {
      return NextResponse.json({ error: 'Invalid size or color' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true, isArchived: true },
    });
    if (!product || product.isArchived) {
      return NextResponse.json({ error: 'This product is no longer available.' }, { status: 409 });
    }

    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: user.id,
        productId: productId,
        size: size || null,
        color: color || null,
      },
    });

    if (product.stock < (existing?.quantity ?? 0) + quantity) {
      return NextResponse.json({ error: 'Requested quantity exceeds available stock.' }, { status: 409 });
    }

    if (existing) {
      // Just update quantity
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true }
      });
      return NextResponse.json(updatedCartItem, { status: 200 });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: user.id,
        productId: productId,
        size: size || null,
        color: color || null,
        quantity: quantity,
      },
      include: {
        product: true,
      }
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
