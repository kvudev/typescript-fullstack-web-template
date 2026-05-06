import { User } from '../domain/User';
import { UserRepository } from '../interfaces/UserRepository';

export interface ListUsersOutput {
  users: User[];
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<ListUsersOutput> {
    const users = await this.userRepository.findAll();
    return { users };
  }
}
