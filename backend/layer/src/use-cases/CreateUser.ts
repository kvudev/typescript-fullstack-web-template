import { randomUUID } from 'crypto';
import { User, CreateUserInput, validateCreateUserInput } from '../domain/User';
import { UserRepository } from '../interfaces/UserRepository';

export interface CreateUserOutput {
  user: User;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    // Validate input using domain rules
    validateCreateUserInput(input);

    // Check email uniqueness
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error(`User with email ${input.email} already exists`);
    }

    const user: User = {
      id: randomUUID(),
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      createdAt: new Date(),
    };

    const saved = await this.userRepository.save(user);
    return { user: saved };
  }
}
