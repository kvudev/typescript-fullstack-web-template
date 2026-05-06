import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@ts-project-template/layer$': '<rootDir>/src/index.ts',
  },
};

export default config;
