/*eslint-disable */
import { IUserRepository, UserFilters, PaginationParams, PaginatedResult } from '@modules/identity/application/interfaces/repository/interface-user-repository';
import { User, UserProps } from '@modules/identity/domain/entities/User';

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = [];

  async save(user: User): Promise<User> {
    const index = this.items.findIndex(item => item.id === user.id);
    if (index >= 0) {
      this.items[index] = user;
    } else {
      if (!user.id) (user as any).props.id = Math.random().toString(36).substr(2, 9);
      this.items.push(user);
    }
    return user;
  }

  async allPaginated(params: PaginationParams): Promise<PaginatedResult<User>> {
    const data = this.items.slice((params.page - 1) * params.limit, params.page * params.limit);
    return {
      data,
      total: this.items.length,
      page: params.page,
    };
  }

  async findBy(filters: UserFilters): Promise<User[]> {
    return this.items.filter(user => {
      if (filters.email && user.email !== filters.email) return false;
      if (filters.id && user.id !== filters.id) return false;
      return true;
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.items.find(user => user.id === id) || null;
  }

  async update(id: string, data: Partial<UserProps>): Promise<User> {
    const index = this.items.findIndex(user => user.id === id);
    if (index < 0) throw new Error('Usuário não encontrado');

    const props = (this.items[index] as any).props;

    if (data.email !== undefined) props.email = data.email;
    if (data.password !== undefined) props.password = data.password;
    if (data.firstName !== undefined) props.firstName = data.firstName;
    if (data.lastName !== undefined) props.lastName = data.lastName;
    if (data.role !== undefined) props.role = data.role;
    if (data.isActive !== undefined) props.isActive = data.isActive;

    return this.items[index];
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(user => user.id !== id);
  }
}
