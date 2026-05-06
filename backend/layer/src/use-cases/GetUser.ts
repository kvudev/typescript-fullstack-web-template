import { User } from '../domain/User';
import { UserRepository } from '../interfaces/UserRepository';

export interface GetUserOutput {
  user: User;
}

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return { user };
  }
}
