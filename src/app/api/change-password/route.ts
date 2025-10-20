import { auth } from '@/lib/config/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await auth();
  const currentId = session?.user?.id;

  if (!currentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  return NextResponse.json(body, { status: 200 });
}
