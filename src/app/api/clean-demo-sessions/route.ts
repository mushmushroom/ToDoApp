import prisma from '@/lib/config/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
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
    return NextResponse.json({ error: 'Error cleaning demo sessions.' }, { status: 500 });
  }
}
