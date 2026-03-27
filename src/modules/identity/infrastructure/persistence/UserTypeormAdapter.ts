import { Like } from 'typeorm';
import { User as DomainUser } from '@modules/identity/domain/entities/User'; 
import { User as PersistenceUser } from './entities/user-entity';
import { UserMapper } from '@modules/identity/application/dtos/user-mappers'; 
import { IUserRepository, UserFilters, PaginationParams, PaginatedResult } from '@modules/identity/application/interfaces/repository/interface-user-repository';
import { AppDataSource } from '@shared/infra/db/data-source';
import { AppError } from '@shared/errors/AppError';

export class TypeOrmUserRepository implements IUserRepository {
  private repository = AppDataSource.getRepository(PersistenceUser);

  async save(user: DomainUser): Promise<DomainUser> {
    const raw = UserMapper.toPersistence(user);
    const saved = await this.repository.save(raw);
    return UserMapper.toDomain(saved);
  }

  async allPaginated(params: PaginationParams): Promise<PaginatedResult<DomainUser>> {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      where: search ? [
        { firstName: Like(`%${search}%`) },
        { lastName: Like(`%${search}%`) },
        { email: Like(`%${search}%`) }
      ] : {},
      take: limit,
      skip: skip,
      order: { createdAt: 'DESC' } as any
    });

    return {
      data: data.map(UserMapper.toDomain),
      total,
      page,
    };
  }

  async findBy(filters: UserFilters): Promise<DomainUser[]> {
      const users = await this.repository.find({ where: filters });
      return users.map(UserMapper.toDomain);
  }

  async findById(id: string): Promise<DomainUser | null> {
    const user = await this.repository.findOne({ where: { id } as any });
    return user ? UserMapper.toDomain(user) : null;
  }

  async update(id: string, data: Partial<import('@modules/identity/domain/entities/User').UserProps>): Promise<DomainUser> {
    try {
      const persistenceData: any = {};

      if ((data as any).email) {
        const email = (data as any).email;
        persistenceData.email = typeof email === 'string' ? email : email.getValue;
      }

      if ((data as any).password) {
        const password = (data as any).password;
        persistenceData.password = typeof password === 'string' ? password : password.getValue;
      }

      if ((data as any).firstName !== undefined) persistenceData.firstName = (data as any).firstName;
      if ((data as any).lastName !== undefined) persistenceData.lastName = (data as any).lastName;
      if ((data as any).role !== undefined) persistenceData.role = (data as any).role;
      if ((data as any).isActive !== undefined) persistenceData.isActive = (data as any).isActive;

      await this.repository.update(id, persistenceData);
      const updated = await this.findById(id);
      if (!updated) throw new AppError('Falha ao recuperar usuário atualizado', 400);
      return updated;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') throw new AppError('email já existe', 409);
      throw new AppError('Erro interno do servidor');
    }
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
