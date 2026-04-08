import { Like } from 'typeorm';
import { User as DomainUser } from '@modules/identity/domain/entities/User'; 
import { User as PersistenceUser } from './entities/user-entity';
import { UserMapper } from '@modules/identity/application/dtos/user-mappers'; 
import { IUserRepository, UserFilters, PaginationParams, PaginatedResult } from '@modules/identity/application/interfaces/repository/interface-user-repository';
import { AppDataSource } from '@shared/infra/db/data-source';

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
      order: { createdAt: 'DESC' }
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
    const user = await this.repository.findOne({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
