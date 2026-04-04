import { ISkuAttributeValueRepository } from '@modules/catalog/application/interfaces/repository/ISkuAttributeValueRepository';
import { Repository } from 'typeorm';
import { SkuAtributoValor } from './entities/SkuAttributeValue';
import { AppDataSource } from '@shared/infra/db/data-source';
import { SkuAttributeValue } from '@modules/catalog/domain/entities/sku-attribute-value';

export class TypeOrmSkuAttributeValueRepository implements ISkuAttributeValueRepository {
  
    private readonly repository: Repository<SkuAtributoValor> = AppDataSource.getRepository(SkuAtributoValor);
  

  async findById(id: string): Promise<SkuAttributeValue | null> {
    const record = await this.repository.findOneBy({ id });
    return record ? this.toDomain(record) : null;
  }

  async findBySkuAndAttribute(skuId: string, attribute_id: string): Promise<SkuAttributeValue | null> {
    const record = await this.repository.findOneBy({ 
      sku_id: skuId, 
      atributo_id: attribute_id 
    });
    return record ? this.toDomain(record) : null;
  }

  async findAllBySku(skuId: string): Promise<SkuAttributeValue[]> {
    const records = await this.repository.findBy({ sku_id: skuId });
    return records.map(this.toDomain);
  }

  async save(entity: SkuAttributeValue): Promise<void> {
    const persistenceModel = this.toPersistence(entity);
    await this.repository.save(persistenceModel);
  }

  async update(entity: SkuAttributeValue): Promise<void> {
    const persistenceModel = this.toPersistence(entity);
    await this.repository.save(persistenceModel);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Mapeia do Banco de Dados para o Domínio (Clean Architecture)
   */
  private toDomain(record: SkuAtributoValor): SkuAttributeValue {
    return SkuAttributeValue.create({
      sku_id: record.sku_id,
      attribute_id: record.atributo_id,
      value: record.value,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    }, record.id);
  }

  /**
   * Mapeia do Domínio para o Banco de Dados (TypeORM)
   */
  private toPersistence(entity: SkuAttributeValue): Partial<SkuAtributoValor> {
    return {
      id: entity.id,
      sku_id: entity.skuId,
      atributo_id: entity.attribute_id,
      value: entity.value,
      updated_at: entity.updatedAt
    };
  }
}
