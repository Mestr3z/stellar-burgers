/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',

    moduleNameMapper: {
      '^@pages/(.*)$': '<rootDir>/src/pages/$1',
      '^@components/(.*)$': '<rootDir>/src/components/$1',
      '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
      '^@ui-pages/(.*)$': '<rootDir>/src/components/ui/pages/$1',
      '^@utils-types$': '<rootDir>/src/utils/types.ts',
      '^@api$': '<rootDir>/src/utils/burger-api.ts',
      '^@slices/(.*)$': '<rootDir>/src/services/slices/$1',
      '^@selectors/(.*)$': '<rootDir>/src/services/selectors/$1',
    },
    testMatch: [
      '<rootDir>/src/**/*.test.ts',
      '<rootDir>/src/**/*.test.tsx',
      '<rootDir>/src/**/__tests__/*.{ts,tsx}'
    ],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json'
      }
    },
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/cypress/',
      '\\.d\\.ts$'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  };
  