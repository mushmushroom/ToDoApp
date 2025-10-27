import { auth } from '@/lib/config/auth';
import prisma from '@/lib/config/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await auth();
  const currentId = session?.user?.id;

  if (!currentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: currentId },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!user.password) {
    return NextResponse.json({ error: 'No password is set for this user' }, { status: 400 });
  }

  const { oldPassword, newPassword } = await request.json();

  const isValid = await bcrypt.compare(oldPassword, user.password);

  if (!isValid) {
    return NextResponse.json({ error: 'The current password is invalid' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: currentId },
    data: {
      password: await bcrypt.hash(newPassword, 10),
    },
  });
  return NextResponse.json({ message: 'Password updated successfully' });
}
