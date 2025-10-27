import { auth } from '@/lib/config/auth';
import prisma from '@/lib/config/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      accounts: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const providers = user.accounts.map((a) => a.provider);
  const isOAuth = providers.length > 0;

  return NextResponse.json({ providers, isOAuth });
}
