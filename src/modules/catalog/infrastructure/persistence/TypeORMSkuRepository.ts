import { AppDataSource } from "@shared/infra/db/data-source";
import { Sku } from "./entities/Sku";
import { Repository } from "typeorm";
import { ISkuRepository } from "@modules/catalog/application/interfaces/repository/ISkuRepository";
import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";
import { SkuMapper } from "@modules/catalog/application/dtos/sku-mapper";
import { BaseCacheRepository } from "./BaseCacheRepository";
import redisClient from "@shared/infra/cache/redis";

export class TypeOrmSkuRepository
extends BaseCacheRepository
implements ISkuRepository {
  private repository: Repository<Sku> = AppDataSource.getRepository(Sku);
  protected CACHE_TAG: string = "sku";

  async create(sku: SkuDomain): Promise<void> {
    const raw = SkuMapper.toPersistence(sku);
    const entity = this.repository.create(raw);
    await this.repository.save(entity);
    this.invalidateCache();
  }

  async update(sku: SkuDomain): Promise<void> {
    const raw = SkuMapper.toPersistence(sku);
    await this.repository.save(raw);
    this.invalidateCache();
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
    const cacheKey = await this.getCacheKey(`productId:${productId}`);
    const cachedResult = await redisClient.get(cacheKey);
    if(cachedResult) {
      return JSON.parse(cachedResult).map((sku:Sku) => SkuMapper.toDomain(sku));
    }
    const skus = await this.repository.findBy({ product_id: productId });
    redisClient.set(cacheKey, JSON.stringify(skus), {EX: this.TTL});
    return skus.map(sku => SkuMapper.toDomain(sku));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
    this.invalidateCache();
  }
}
