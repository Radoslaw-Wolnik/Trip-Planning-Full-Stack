module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    globalSetup: '<rootDir>/tests/setup.ts',
    globalTeardown: '<rootDir>/tests/teardown.ts',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.{js,ts}',
      '!src/**/*.d.ts',
      '!src/types/**/*',
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    // Add separate configurations for different test types
    projects: [
      {
        displayName: 'unit',
        testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
      },
      {
        displayName: 'integration',
        testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
      },
      {
        displayName: 'e2e',
        testMatch: ['<rootDir>/tests/e2e/**/*.test.ts'],
        testEnvironment: 'node',
        setupFilesAfterEnv: ['<rootDir>/tests/e2e-setup.ts'],
      },
    ],
  };