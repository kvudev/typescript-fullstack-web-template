import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserUseCase, GetUserUseCase, ListUsersUseCase } from '@news-summarizer/layer';
import { PrismaUserRepository, getPrismaClient } from '@news-summarizer/db';

const prisma = getPrismaClient();
const userRepository = new PrismaUserRepository(prisma);

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: CreateUserUseCase,
      useValue: new CreateUserUseCase(userRepository),
    },
    {
      provide: GetUserUseCase,
      useValue: new GetUserUseCase(userRepository),
    },
    {
      provide: ListUsersUseCase,
      useValue: new ListUsersUseCase(userRepository),
    },
    UserService,
  ],
})
export class UserModule {}
