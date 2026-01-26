import NextAuth, { AuthError, CredentialsSignin, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { AdapterUser } from 'next-auth/adapters';

import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isDemo = (user as AdapterUser & { isDemo?: boolean }).isDemo ?? false;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (!session?.user) return session;

      session.user.id = token.sub ?? '';
      session.user.isDemo = token.isDemo ?? false;

      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub ?? '' },
        select: { id: true },
      });

      if (!existingUser) {
        return null as unknown as Session;
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

        if (email.startsWith('demo-')) {
          let demoUser = await prisma.user.findUnique({
            where: { email },
          });

          if (!demoUser) {
            const { user, categories } = await prisma.$transaction(async (tx) => {
              const user = await tx.user.create({
                data: {
                  email,
                  name: 'Demo User',
                  isDemo: true,
                  password: await bcrypt.hash('demo', 10),
                },
              });

              const work = await tx.categories.create({
                data: { name: 'Work', userId: user.id },
              });

              const personal = await tx.categories.create({
                data: { name: 'Personal', userId: user.id },
              });

              const shopping = await tx.categories.create({
                data: { name: 'Shopping', userId: user.id },
              });

              return {
                user,
                categories: { work, personal, shopping },
              };
            });

            demoUser = user;

            await prisma.tasks.createMany({
              data: [
                {
                  title: 'Welcome to your demo account!',
                  userId: demoUser.id,
                  categoriesId: categories.work.id,
                },
                {
                  title: 'This is your first task.',
                  userId: demoUser.id,
                  categoriesId: categories.personal.id,
                },
                {
                  title: 'Feel free to explore the app.',
                  userId: demoUser.id,
                  categoriesId: categories.shopping.id,
                },
              ],
            });
          }

          return demoUser;
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          throw new AuthError('No user found with this email');
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password!);

        if (!isValid) {
          throw new CredentialsSignin('INVALID_CREDENTIALS');
        }

        const isVerified = user.email_verified;

        if (!isVerified) {
          throw new CredentialsSignin('EMAIL_NOT_VERIFIED');
        }
        return { id: user.id, name: user.name, email: user.email, isDemo: user.isDemo };
      },
    }),
  ],
});
