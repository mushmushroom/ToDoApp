import { auth } from '@/lib/config/auth';
import prisma from '@/lib/config/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const currentId = session?.user?.id;

  if (!currentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: currentId,
    },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (user.isDemo) NextResponse.json({ error: 'Not avaiable for demo users' }, { status: 401 });

  const { id: categoryId } = await context.params;

  const body = await request.json();
  const { name } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }

  const existingCategory = await prisma.categories.findFirst({
    where: {
      userId: currentId,
      id: categoryId,
    },
  });

  if (!existingCategory) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updatedCategory = await prisma.categories.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
    },
  });

  return NextResponse.json(updatedCategory, { status: 200 });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const currentId = session?.user?.id;

  if (!currentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: currentId,
    },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (user.isDemo) NextResponse.json({ error: 'Not avaiable for demo users' }, { status: 401 });

  const { id: categoryId } = await context.params;
  const deleteTasks = request.nextUrl.searchParams.get('deleteTasks') === 'true';

  const category = await prisma.categories.findFirst({
    where: {
      id: categoryId,
      userId: currentId,
    },
  });

  if (!category) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.$transaction([
    ...(deleteTasks
      ? [
          prisma.tasks.deleteMany({
            where: {
              userId: currentId,
              categoriesId: categoryId,
            },
          }),
        ]
      : [
          prisma.tasks.updateMany({
            where: {
              userId: currentId,
              categoriesId: categoryId,
            },
            data: {
              categoriesId: null,
            },
          }),
        ]),
    prisma.categories.delete({
      where: { id: categoryId },
    }),
  ]);

  return NextResponse.json({ success: true }, { status: 200 });
}
