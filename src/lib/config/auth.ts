import NextAuth, { AuthError } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';

import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';
// import { saltAndHashPassword } from '@/lib/helper';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const email = credentials.email as string;

        let user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          throw new AuthError('No user found with this email');
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password!);

        if (!isValid) {
          throw new Error('Invalid password');
        }
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  // callbacks: {
  //   session: async ({ session, user }) => {
  //     if (session?.user) {
  //       session.user.id = user.id;
  //     }
  //     return session;
  //   },
  // },
});
