// import NextAuth from 'next-auth';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import { PrismaClient } from '@prisma/client';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// const handler = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         const { email, password } = credentials as {
//           email: string;
//           password: string;
//         };

//         const user = await prisma.user.findUnique({ where: { email } });
//         if (!user || !user.password) return null;

//         const isValid = await bcrypt.compare(password, user.password);
//         if (!isValid) return null;

//         return user;
//       },
//     }),
//   ],
//   session: { strategy: 'jwt' },
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };
import { handlers } from '@/config/auth';

export const { GET, POST } = handlers;
// export { handlers as GET, handlers as POST };
