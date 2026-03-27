import { CreateUserUseCase, DeleteUserUseCase, ListUsersUseCase, UpdateUserUseCase, FindUsersUseCase } from '@modules/identity/application/use-cases/user-use-cases';
import { LoginUseCase } from '@modules/identity/application/use-cases/auth-use-cases';
import { InMemoryUserRepository } from './mockUserRepository';
import { UserRole } from '@modules/identity/domain/entities/User';

describe('Identity module use cases', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  describe('Create/List/Find/Delete/Update User', () => {
    it('should create a user and read it', async () => {
      const createUser = new CreateUserUseCase(repository);
      const listUsers = new ListUsersUseCase(repository);
      const findUsers = new FindUsersUseCase(repository);

      const user = await createUser.execute({
        email: 'john.doe@example.com',
        password: 'supersecret',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.CLIENT,
      });

      expect(user).toHaveProperty('id');
      expect(user.email).toBe('john.doe@example.com');
      expect(user.fullName).toBe('John Doe');

      const paginated = await listUsers.execute({ page: 1, limit: 10 });
      expect(paginated.total).toBe(1);
      expect(paginated.data[0].email).toBe('john.doe@example.com');

      const found = await findUsers.execute({ email: 'john.doe@example.com' });
      expect(found[0].id).toBe(user.id);
    });

    it('should update a user', async () => {
      const createUser = new CreateUserUseCase(repository);
      const updateUser = new UpdateUserUseCase(repository);

      const user = await createUser.execute({
        email: 'jane.doe@example.com',
        password: 'pass1234',
        firstName: 'Jane',
        lastName: 'Doe',
        role: UserRole.CLIENT,
      });

      const updated = await updateUser.execute(user.id, {
        firstName: 'Janet',
        lastName: 'Doe-Smith',
        role: UserRole.ADMIN,
      });

      expect(updated.fullName).toBe('Janet Doe-Smith');
      expect(updated.role).toBe('admin');
    });

    it('should delete a user', async () => {
      const createUser = new CreateUserUseCase(repository);
      const deleteUser = new DeleteUserUseCase(repository);

      const user = await createUser.execute({
        email: 'bye.user@example.com',
        password: 'pass1234',
        firstName: 'Bye',
        lastName: 'User',
        role: UserRole.CLIENT,
      });

      expect(repository.items.length).toBe(1);

      await deleteUser.execute(user.id);
      expect(repository.items.length).toBe(0);

      await expect(deleteUser.execute('inexistent-id')).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('Auth use case', () => {
    it('should login with valid user and credentials', async () => {
      const createUser = new CreateUserUseCase(repository);
      const login = new LoginUseCase(repository);

      const user = await createUser.execute({
        email: 'auth.user@example.com',
        password: 'authpass123',
        firstName: 'Auth',
        lastName: 'User',
        role: UserRole.CLIENT,
      });

      const result = await login.execute({ email: user.email, password: 'authpass123' });

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(user.email);
    });

    it('should fail login with invalid credentials', async () => {
      const login = new LoginUseCase(repository);
      await expect(login.execute({ email: 'nobody@example.com', password: 'wrong' })).rejects.toThrow('Credenciais inválidas');
    });

    it('should fail login if password is wrong', async () => {
      const createUser = new CreateUserUseCase(repository);
      const login = new LoginUseCase(repository);

      await createUser.execute({
        email: 'auth.user2@example.com',
        password: 'correct_pwd',
        firstName: 'Auth2',
        lastName: 'User2',
        role: UserRole.CLIENT,
      });

      await expect(login.execute({ email: 'auth.user2@example.com', password: 'wrong_pwd' })).rejects.toThrow('Credenciais inválidas');
    });
  });
});
