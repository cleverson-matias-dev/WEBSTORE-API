import { ISkuAttributeValueRepository } from '@modules/catalog/application/interfaces/repository/ISkuAttributeValueRepository';
import { Repository } from 'typeorm';
import { AppDataSource } from '@shared/infra/db/data-source';
import { SkuAttributeValue as RepositoryEntity } from './entities/SkuAttributeValue';
import { SkuAttributeValue as DomainEntity } from '@modules/catalog/domain/entities/sku-attribute-value';

export class TypeOrmSkuAttributeValueRepository implements ISkuAttributeValueRepository {
  
    private readonly repository: Repository<RepositoryEntity> = AppDataSource.getRepository(RepositoryEntity);
  

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
    const records = await this.repository.findBy({ sku_id: skuId });
    return records.map(this.toDomain);
  }

  async save(entity: DomainEntity): Promise<void> {
    const persistenceModel = this.toPersistence(entity);
    await this.repository.save(persistenceModel);
  }

  async update(entity: DomainEntity): Promise<void> {
    const persistenceModel = this.toPersistence(entity);
    await this.repository.save(persistenceModel);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
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
