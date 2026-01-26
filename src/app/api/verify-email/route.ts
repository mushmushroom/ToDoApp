import prisma from '@/lib/config/prisma';
import { hashToken } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  const hashedToken = hashToken(token);

  const storedToken = await prisma.userTokens.findFirst({
    where: {
      token: hashedToken,
      type: 'REGISTER',
      expiresAt: { gt: new Date() },
      used: false,
    },
    include: {
      user: true,
    },
  });

  if (!storedToken || !storedToken.user) {
    return NextResponse.json({ error: 'Token is invalid or expired' }, { status: 400 });
  }

  const userId = storedToken.user.id;

  const updatedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: { email_verified: true },
    });

    await tx.userTokens.updateMany({
      where: { userId: storedToken.userId, type: 'REGISTER' },
      data: { used: true },
    });

    return user;
  });

  return NextResponse.json({ success: true, email_verified: updatedUser.email_verified });
}
