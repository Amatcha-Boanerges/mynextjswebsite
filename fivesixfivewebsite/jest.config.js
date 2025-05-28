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
    '<rootDir>/playwright-report/'
  ],
  // Tell Jest to transform ALL node_modules. 
  // next/jest should use SWC for this.
  transformIgnorePatterns: [], 
  // For ts-jest specific options, if you were using it directly (next/jest handles this)
  // preset: 'ts-jest', 
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig); 