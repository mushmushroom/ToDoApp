import prisma from '@/lib/config/prisma';
import { API_URL, CHAR_LIMIT } from './src/lib/constants'

import bcrypt from 'bcryptjs';
import { defineConfig } from 'cypress';


type Version = 'local' | 'staging' | 'prod';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        // delete user
        async deleteUser(email) {
          console.log(`Deleting user: ${email}`);
          await prisma.user.deleteMany({
            where: { email },
          });
          return null;
        },

        // create user
        async createUser({ email, password }) {
          const hash = await bcrypt.hash(password, 10);

          await prisma.user.create({
            data: { email, password: hash },
          });

          return null;
        },
      });

      const version = (config.env.VERSION || 'local') as Version;

      const urls: Record<Version, string> = {
        local: 'http://localhost:3000',
        staging: 'https://to-do-app-git-dev-mushmushrooms-projects.vercel.app',
        prod: 'https://to-do-app-xi-jade.vercel.app/',
      };

      // choosing version from urls object
      config.baseUrl = urls[version];

      return config;
    },
    env: {
      API_E2E_URL: API_URL,
      COOKIE_NAME: 'next-auth.session-token',
      CHAR_LIMIT: CHAR_LIMIT
    },
  },
});
