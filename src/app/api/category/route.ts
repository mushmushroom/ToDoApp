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
  });

  return NextResponse.json(categories, { status: 200 });
}
