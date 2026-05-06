import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@news-summarizer/layer$': '<rootDir>/src/index.ts',
  },
};

export default config;
