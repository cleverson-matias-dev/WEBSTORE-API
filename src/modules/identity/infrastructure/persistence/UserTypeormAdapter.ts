import { Like } from 'typeorm';
import { User as DomainUser } from '@modules/identity/domain/entities/User'; 
import { User as PersistenceUser } from './entities/user-entity';
import { UserMapper } from '@modules/identity/application/dtos/user-mappers'; 
import { IUserRepository, UserFilters, PaginationParams, PaginatedResult } from '@modules/identity/application/interfaces/repository/interface-user-repository';
import { AppDataSource } from '@shared/infra/db/data-source';
import { BaseCacheRepository } from './BaseCacheRepository';
import redisClient from '@shared/infra/cache/redis';

export class TypeOrmUserRepository
extends BaseCacheRepository
implements IUserRepository {
  private repository = AppDataSource.getRepository(PersistenceUser);
  protected CACHE_TAG: string = "user";

  async save(user: DomainUser): Promise<DomainUser> {
    const raw = UserMapper.toPersistence(user);
    const saved = await this.repository.save(raw);
    this.invalidateCache();
    return UserMapper.toDomain(saved);
  }

  async allPaginated(params: PaginationParams): Promise<PaginatedResult<DomainUser>> {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const cacheKey = await this.getCacheKey(`p:${page}l:${limit}s:${search}`);
    const cachedResult = await redisClient.get(cacheKey);
    if(cachedResult) {
      const [data, total] = JSON.parse(cachedResult);
      return {
        data: data.map(UserMapper.toDomain),
        total,
        page,
      };
    }

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

    await redisClient.set(cacheKey, JSON.stringify([data, total]), {EX: this.TTL})
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
    this.invalidateCache();
  }
}
