const nextJest = require('next/jest');

// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: './', 
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], 
  testEnvironment: 'jest-environment-jsdom',
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'], 
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Ensure js/jsx are included
  testPathIgnorePatterns: [
    '<rootDir>/.next/', 
    '<rootDir>/node_modules/', 
    // Ignore the playwright test directory if it exists, to prevent conflicts
    '<rootDir>/tests-e2e/', // Example: if your Playwright tests are in 'tests-e2e'
    '<rootDir>/playwright-report/',
    '<rootDir>/src/lib/markdown.test.ts.skip' // Keep skipping the other test file for now
  ],
  // Try a more focused list of ESM packages to transform
  transformIgnorePatterns: [
    '/node_modules/(?!gray-matter)/'
  ],
  // For ts-jest specific options, if you were using it directly (next/jest handles this)
  // preset: 'ts-jest', 
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig); 