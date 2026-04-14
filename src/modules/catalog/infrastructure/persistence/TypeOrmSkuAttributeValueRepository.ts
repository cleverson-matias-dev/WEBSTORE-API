import { ISkuAttributeValueRepository } from '@modules/catalog/application/interfaces/repository/ISkuAttributeValueRepository';
import { Repository } from 'typeorm';
import { AppDataSource } from '@shared/infra/db/data-source';
import { SkuAttributeValue as RepositoryEntity } from './entities/SkuAttributeValue';
import { SkuAttributeValue as DomainEntity } from '@modules/catalog/domain/entities/sku-attribute-value';
import { BaseCacheRepository } from './BaseCacheRepository';
import redisClient from '@shared/infra/cache/redis';

export class TypeOrmSkuAttributeValueRepository
extends BaseCacheRepository
implements ISkuAttributeValueRepository {
  
  private readonly repository: Repository<RepositoryEntity> = AppDataSource.getRepository(RepositoryEntity);
  protected CACHE_TAG: string = "sku_attribute_value";
  

  async findById(id: string): Promise<DomainEntity | null> {
    const record = await this.repository.findOneBy({ id });
    return record ? this.toDomain(record) : null;
  }

  async findBySkuAndAttribute(sku_id: string, attribute_id: string): Promise<DomainEntity | null> {
    const record = await this.repository.findOneBy({ 
      sku_id, 
      attribute_id 
    });
    return record ? this.toDomain(record) : null;
  }

  async findAllBySku(skuId: string): Promise<DomainEntity[]> {
    const cacheKey = await this.getCacheKey(`skuId:${skuId}`);
    const cachedData = await redisClient.get(cacheKey);
    if(cachedData) {
      return JSON.parse(cachedData).map(this.toDomain);
    }

    const records = await this.repository.findBy({ sku_id: skuId });
    await redisClient.set(cacheKey, JSON.stringify(records), {EX: this.TTL});
    return records.map(this.toDomain);
  }

  async save(entity: DomainEntity): Promise<void> {
    const persistenceModel = this.toPersistence(entity);
    await this.repository.save(persistenceModel);
    this.invalidateCache();
  }

  async update(entity: DomainEntity): Promise<void> {
    const persistenceModel = this.toPersistence(entity);
    await this.repository.save(persistenceModel);
    this.invalidateCache();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
    this.invalidateCache();
  }

  /**
   * Mapeia do Banco de Dados para o Domínio (Clean Architecture)
   */
  private toDomain(record: RepositoryEntity): DomainEntity {
    return DomainEntity.create({
      sku_id: record.sku_id,
      attribute_id: record.attribute_id,
      value: record.value,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    }, record.id);
  }

  /**
   * Mapeia do Domínio para o Banco de Dados (TypeORM)
   */
  private toPersistence(entity: DomainEntity): Partial<RepositoryEntity> {
    return {
      id: entity.id,
      sku_id: entity.skuId,
      attribute_id: entity.attribute_id,
      value: entity.value,
      updated_at: entity.updatedAt
    };
  }
}
