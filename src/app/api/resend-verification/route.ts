import prisma from '@/lib/config/prisma';
import { sendMail } from '@/lib/send-email';
import { createVerificationToken } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.email_verified) {
    return NextResponse.json({ success: true });
  }

  await prisma.userTokens.updateMany({
    where: {
      userId: user.id,
      type: 'REGISTER',
    },
    data: {
      used: true,
    },
  });

  const { token, hashedToken } = createVerificationToken();

  await prisma.userTokens.create({
    data: {
      userId: user.id,
      token: hashedToken,
      type: 'REGISTER',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email?token=${token}`;

  await sendMail({
    sendTo: email,
    subject: 'Verify your email address',
    text: `Click the link to verify your email:\n\n${verifyUrl}`,
    html: `
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">Verify email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });

  return NextResponse.json({ success: true });
}
