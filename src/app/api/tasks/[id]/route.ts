import { auth } from '@/config/auth';
import prisma from '@/config/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  const currentId = session?.user?.id;

  if (!currentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const task = await prisma.tasks.findFirst({
    where: {
      userId: currentId,
      id: id,
    },
  });

  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(task, { status: 200 });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const currentId = session?.user?.id;

  if (!currentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: taskId } = await context.params;

  const body = await request.json();
  const { title, completed } = body;

  const existingTask = await prisma.tasks.findFirst({
    where: {
      userId: currentId,
      id: taskId,
    },
  });

  if (!existingTask) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updatedTask = await prisma.tasks.update({
    where: {
      id: taskId,
    },
    data: {
      title: title ?? existingTask.title,
      completed: completed ?? existingTask.completed,
    },
  });

  return NextResponse.json(updatedTask, { status: 200 });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  const currentId = session?.user?.id;

  if (!currentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const task = await prisma.tasks.findFirst({
    where: {
      id: params.id,
      userId: currentId,
    },
  });

  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.tasks.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true }, { status: 200 });
}
