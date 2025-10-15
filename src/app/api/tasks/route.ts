import { auth } from '@/lib/config/auth';
import prisma from '@/lib/config/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  const currentId = session?.user?.id;

  if (!currentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tasks = await prisma.tasks.findMany({
    where: {
      userId: currentId,
    },
    orderBy: [
      {
        completed: 'asc',
      },
      {
        createdAt: 'asc',
      },
    ],
  });

  return NextResponse.json(tasks, { status: 200 });
}

export async function POST(request: Request) {
  const session = await auth();
  const currentId = session?.user?.id;

  if (!currentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title } = body;

  if (!title) {
    return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
  }

  const newTask = await prisma.tasks.create({
    data: {
      title,
      userId: currentId,
    },
  });

  return NextResponse.json(newTask, { status: 201 });
}
