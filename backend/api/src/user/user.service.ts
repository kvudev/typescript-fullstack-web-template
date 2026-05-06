import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserUseCase, GetUserUseCase, ListUsersUseCase } from '@news-summarizer/layer';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const { user } = await this.createUserUseCase.execute(dto);
      return new UserResponseDto(user);
    } catch (err) {
      if (err instanceof Error && err.message.includes('already exists')) {
        throw new ConflictException(err.message);
      }
      throw err;
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    try {
      const { user } = await this.getUserUseCase.execute(id);
      return new UserResponseDto(user);
    } catch (err) {
      if (err instanceof Error && err.message.includes('not found')) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const { users } = await this.listUsersUseCase.execute();
    return users.map((u) => new UserResponseDto(u));
  }
}
