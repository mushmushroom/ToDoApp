import prisma from "@/lib/config/prisma";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  return Response.json({
    exists: !!user,
    verified: !!user?.email_verified,
  });
}
