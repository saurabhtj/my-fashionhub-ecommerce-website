import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const ADDRESS_TYPES = ['HOME', 'WORK', 'OTHER'] as const;

function parseAddress(body: unknown) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null;

  const fields = body as Record<string, unknown>;
  const requiredFields = ['houseNumber', 'street', 'area', 'city', 'state', 'pincode', 'country'] as const;
  if (requiredFields.some((field) => typeof fields[field] !== 'string' || !fields[field].trim())) return null;

  const addressType = typeof fields.addressType === 'string' ? fields.addressType.toUpperCase() : 'HOME';
  if (!ADDRESS_TYPES.includes(addressType as (typeof ADDRESS_TYPES)[number])) return null;

  const houseNumber = (fields.houseNumber as string).trim();
  const street = (fields.street as string).trim();
  const area = (fields.area as string).trim();
  const city = (fields.city as string).trim();
  const state = (fields.state as string).trim();
  const pincode = (fields.pincode as string).trim();
  const country = (fields.country as string).trim();
  const landmark = typeof fields.landmark === 'string' ? fields.landmark.trim() : '';
  if (!/^\d{6}$/.test(pincode)) return null;

  return {
    address: [houseNumber, street, area, landmark].filter(Boolean).join(', '),
    houseNumber,
    street,
    area,
    landmark: landmark || null,
    city,
    state,
    pincode,
    country,
    addressType,
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Fetch addresses error:', error);
    return NextResponse.json({ error: 'Could not fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const addressData = parseAddress(await request.json());
    if (!addressData) {
      return NextResponse.json({ error: 'Complete the required address fields and enter a valid 6-digit PIN code' }, { status: 400 });
    }
    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        ...addressData,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error('Create address error:', error);
    return NextResponse.json({ error: 'Could not save address' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Address ID required' }, { status: 400 });

    const currentAddress = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!currentAddress) return NextResponse.json({ error: 'Address not found' }, { status: 404 });

    const addressData = parseAddress(await request.json());
    if (!addressData) {
      return NextResponse.json({ error: 'Complete the required address fields and enter a valid 6-digit PIN code' }, { status: 400 });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: addressData,
    });
    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Update address error:', error);
    return NextResponse.json({ error: 'Could not update address' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Address ID required' }, { status: 400 });

    await prisma.address.deleteMany({ where: { id, userId: user.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json({ error: 'Could not delete address' }, { status: 500 });
  }
}
