import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { User, UserRepository } from '@news-summarizer/layer';

// Map Prisma model → domain type (never expose Prisma types outside db/)
function toDomain(prismaUser: PrismaUser): User {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    createdAt: prismaUser.createdAt,
  };
}

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<User> {
    const created = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
    return toDomain(created);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map(toDomain);
  }
}
