import prisma from '@/lib/config/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const url = new URL(req.url);
  const secretFromQuery = url.searchParams.get('secret');

  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    secretFromQuery === process.env.CRON_SECRET ||
    process.env.VERCEL === '1';

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const demoUsers = await prisma.user.findMany({
      where: { isDemo: true },
      select: { id: true },
    });

    if (demoUsers.length > 0) {
      const demoUserIds = demoUsers.map((u) => u.id);
      await prisma.tasks.deleteMany({
        where: {
          userId: { in: demoUserIds },
        },
      });

      await prisma.user.deleteMany({
        where: { id: { in: demoUserIds } },
      });
      return NextResponse.json({
        message: `Deleted ${demoUserIds.length} demo users and their tasks.`,
      });
    }

    return NextResponse.json({
      message: `No demo users found to delete.`,
    });
  } catch (error) {
    return NextResponse.json({ error: `Error cleaning demo sessions: ${error}` }, { status: 500 });
  }
}
