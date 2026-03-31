import { AppDataSource } from "@shared/infra/db/data-source";
import { Sku } from "./entities/Sku";
import { Repository } from "typeorm";
import { ISkuRepository } from "@modules/catalog/application/interfaces/repository/ISkuRepository";
import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";
import { SkuMapper } from "@modules/catalog/application/dtos/sku-mapper";

export class TypeOrmSkuRepository implements ISkuRepository {
  private repository: Repository<Sku> = AppDataSource.getRepository(Sku);

  async create(sku: SkuDomain): Promise<void> {
    const raw = SkuMapper.toPersistence(sku);
    const entity = this.repository.create(raw);
    await this.repository.save(entity);
  }

  async update(sku: SkuDomain): Promise<void> {
    const raw = SkuMapper.toPersistence(sku);
    await this.repository.save(raw); // O save do TypeORM faz update se houver ID
  }

  async findById(id: string): Promise<SkuDomain | null> {
    const sku = await this.repository.findOneBy({ id });
    return sku ? SkuMapper.toDomain(sku) : null;
  }

  async findByCode(skuCode: string): Promise<SkuDomain | null> {
    const sku = await this.repository.findOneBy({ codigo_sku: skuCode.toUpperCase() });
    return sku ? SkuMapper.toDomain(sku) : null;
  }

  async findByProductId(productId: string): Promise<SkuDomain[]> {
    const skus = await this.repository.findBy({ product_id: productId });
    return skus.map(sku => SkuMapper.toDomain(sku));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
