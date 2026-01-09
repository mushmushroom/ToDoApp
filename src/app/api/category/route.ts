import { auth } from '@/lib/config/auth';
import prisma from '@/lib/config/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  const currentId = session?.user?.id;

  if (!currentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const categories = await prisma.categories.findMany({
    where: {
      userId: currentId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return NextResponse.json(categories, { status: 200 });
}

export async function POST(request: Request) {
  const session = await auth();
  const currentId = session?.user?.id;

  if (!currentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }

  const newCategory = await prisma.categories.create({
    data: {
      name,
      userId: currentId,
    },
  });

  return NextResponse.json(newCategory, { status: 201 });
}
