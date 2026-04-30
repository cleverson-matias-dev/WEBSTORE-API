import { Attribute } from "@modules/catalog/domain/entities/attribute.entity";
import { AttributeEntity } from "./entities/AttributeEntity";
import { AppDataSource } from "@shared/infra/db/data-source";
import { In, Like, Repository } from "typeorm";
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
        return Attribute.restore(val.id, {
            name: new AttributeName(val.name),
            createdAt: val.created_at,
            updatedAt: val.updated_at
        });
    }

    async save(attribute: Attribute): Promise<Attribute> {
        const data = this.repository.create({ name: attribute.name });
        const saved = await this.repository.save(data);
        await this.invalidateCache();
        return this.toDomain(saved);
    }

    async allPaginated(options: AttributeFilterOptions): Promise<[Attribute[], number]> {
    const { limit, offset, name } = options;

    const cacheKey = `attributes:p:${offset}:l:${limit}:n:${name ?? 'all'}`;
    
    const cachedRaw = await redisClient.get(cacheKey);
    if (cachedRaw) {
        const [rawEntities, total] = JSON.parse(cachedRaw);
        return [rawEntities.map((e: AttributeEntity) => this.toDomain(e)), total as number];
    }

    const [entities, total] = await this.repository.findAndCount({
        where: name ? { name: Like(`%${name}%`) } : {},
        take: limit,
        skip: offset,
        order: { name: 'ASC' }
    });

    const domainEntities = entities.map(entity => this.toDomain(entity));
    const result: [Attribute[], number] = [domainEntities, total];

    redisClient.set(cacheKey, JSON.stringify([entities, total]), {
        EX: this.TTL
    });

    return result;
    }


    async findBy(id: string): Promise<Attribute | null> {
        const result = await this.repository.findOneBy({id});
        return result ? this.toDomain(result) : null;
    }

    async findByName(name: string): Promise<Attribute | null> {
        const result = await this.repository.findOneBy({name});
        return result ? this.toDomain(result) : null;
    }

    async findAllByName(names: string[]): Promise<Attribute[]> {
        const results = await this.repository.find({where: {name: In(names)}})
        return results.map(result => this.toDomain(result))
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