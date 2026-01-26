import prisma from '@/lib/config/prisma';
import { sendMail } from '@/lib/send-email';
import { createVerificationToken } from '@/lib/utils';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password, captchaToken } = await req.json();
  const normalizedEmail = email.toLowerCase().trim();

  // verify captcha
  const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
  });

  const verifyData = await verifyRes.json();
  if (!verifyData.success) {
    return NextResponse.json({ error: 'Captcha verification failed.' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const { token, hashedToken } = createVerificationToken();

  const user = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: normalizedEmail, password: hashedPassword },
    });

    await tx.userTokens.create({
      data: {
        token: hashedToken,
        type: 'REGISTER',
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return user;
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email?token=${token}`;

  await sendMail({
    sendTo: normalizedEmail,
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
