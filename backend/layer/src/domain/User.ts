// Domain entity — pure TypeScript, no framework dependencies

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export class UserDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserDomainError';
  }
}

export function validateCreateUserInput(input: CreateUserInput): void {
  if (!input.name || input.name.trim().length < 2) {
    throw new UserDomainError('Name must be at least 2 characters');
  }
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    throw new UserDomainError('Invalid email address');
  }
}
