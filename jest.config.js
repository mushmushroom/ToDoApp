/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },

  // ✅ Include useful setup for RTL
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // ✅ Let Jest resolve these extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // ✅ Handle CSS and static imports used by Next.js
  moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  collectCoverage:true,
};
