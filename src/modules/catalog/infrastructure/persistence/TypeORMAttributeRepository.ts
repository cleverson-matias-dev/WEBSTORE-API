import { Attribute } from "@modules/catalog/domain/entities/attribute.entity";
import { AttributeEntity } from "./entities/AttributeEntity";
import { AppDataSource } from "@shared/infra/db/data-source";
import { Like, Repository } from "typeorm";
import { AttributeFilterOptions, IAttributeRepository } from "@modules/catalog/application/interfaces/repository/IAttributeRepository";
import { AttributeName } from "@modules/catalog/domain/value-objects/attribute.name.vo";
import { AppError } from "@shared/errors/AppError";
import redisClient from "@shared/infra/cache/redis";
import { BaseCacheRepository } from "./BaseCacheRepository";

export class TypeORMAttributeRepository
 extends BaseCacheRepository
 implements IAttributeRepository {
    private repository: Repository<AttributeEntity> = AppDataSource.getRepository(AttributeEntity);
    protected readonly CACHE_TAG = "attributes";

    private toDomain(val: AttributeEntity): Attribute {
        return new Attribute({
            id: val.id,
            name: new AttributeName(val.name),
            created_at: val.created_at,
            updated_at: val.updated_at
        });
    }

    async save(attribute: Attribute): Promise<Attribute> {
        const { name } = attribute.getProps();
        const data = this.repository.create({ name: name.val() });
        const saved = await this.repository.save(data);
        await this.invalidateCache();
        return this.toDomain(saved);
    }

    async allPaginated(options: AttributeFilterOptions): Promise<[Attribute[], number]> {
        const { limit, offset, name } = options;

        const cacheKey = await this.getCacheKey(`p:${offset}:l:${limit}:n:${name || 'all'}`); 
        
        const cachedResult = await redisClient.get(cacheKey);

        if (cachedResult) {
            const [rawEntities, total] = JSON.parse(cachedResult);
            const domainAttributes = rawEntities.map((e: AttributeEntity) => this.toDomain(e));
            return [domainAttributes, total];
        }

        const [entities, total] = await this.repository.findAndCount({
            where: name ? { name: Like(`%${name}%`) } : {},
            take: limit,
            skip: offset,
            order: { name: 'ASC' }
        });

        await redisClient.set(cacheKey, JSON.stringify([entities, total]), {
            EX: this.TTL
        });

        return [entities.map(entity => this.toDomain(entity)), total];
    }


    async findBy(id: string): Promise<Attribute | null> {
        const result = await this.repository.findOneBy({id});
        return result ? this.toDomain(result) : null;
    }

    async findByName(name: string): Promise<Attribute | null> {
        const result = await this.repository.findOneBy({name});
        return result ? this.toDomain(result) : null;
    }

    async update(id: string, name: string): Promise<void> {
        this.repository.update(id, {name: name});
        await this.invalidateCache();
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        const success = !!(result.affected && result.affected > 0);
        if(!success) throw new AppError('recurso não encontrado', 404);
        await this.invalidateCache();
        return success
    }
    
}