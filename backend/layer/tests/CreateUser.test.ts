import { CreateUserUseCase } from '../src/use-cases/CreateUser';
import { UserRepository } from '../src/interfaces/UserRepository';
import { User } from '../src/domain/User';

function mockUserRepository(overrides: Partial<UserRepository> = {}): UserRepository {
  return {
    save: jest.fn(async (user: User) => user),
    findById: jest.fn(async () => null),
    findByEmail: jest.fn(async () => null),
    findAll: jest.fn(async () => []),
    ...overrides,
  };
}

describe('CreateUserUseCase', () => {
  it('creates a user with valid input', async () => {
    const repo = mockUserRepository();
    const useCase = new CreateUserUseCase(repo);

    const result = await useCase.execute({ name: 'Alice', email: 'alice@example.com' });

    expect(result.user.name).toBe('Alice');
    expect(result.user.email).toBe('alice@example.com');
    expect(result.user.id).toBeDefined();
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('throws if email already exists', async () => {
    const existingUser: User = {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      createdAt: new Date(),
    };
    const repo = mockUserRepository({
      findByEmail: jest.fn(async () => existingUser),
    });
    const useCase = new CreateUserUseCase(repo);

    await expect(
      useCase.execute({ name: 'Bob', email: 'alice@example.com' })
    ).rejects.toThrow('already exists');
  });

  it('throws on invalid name', async () => {
    const repo = mockUserRepository();
    const useCase = new CreateUserUseCase(repo);

    await expect(useCase.execute({ name: 'A', email: 'a@example.com' })).rejects.toThrow(
      'Name must be at least 2 characters'
    );
  });

  it('throws on invalid email', async () => {
    const repo = mockUserRepository();
    const useCase = new CreateUserUseCase(repo);

    await expect(useCase.execute({ name: 'Alice', email: 'not-an-email' })).rejects.toThrow(
      'Invalid email address'
    );
  });
});
