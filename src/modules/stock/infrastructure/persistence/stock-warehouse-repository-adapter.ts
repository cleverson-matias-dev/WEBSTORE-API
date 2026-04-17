import type { IStockWarehouseRepository } from "@modules/stock/application/interfaces/repository/stock-warehouse-repository-interface";
import { StockWarehouseSchema } from "./entities/StockWarehouseSchema";
import type { Repository } from "typeorm";
import { StockWarehouse, type StockWarehouseProps } from "@modules/stock/domain/entities/stock-warehouse";
import { AppDataSource } from "@shared/infra/db/data-source";
import { BaseCacheRepository } from "./base-cache-respository";
import redisClient from "@shared/infra/cache/redis";

export class TypeOrmStockWarehouseRepository 
extends BaseCacheRepository
implements IStockWarehouseRepository {
  private repository: Repository<StockWarehouseSchema> = AppDataSource.getRepository(StockWarehouseSchema);
  protected CACHE_TAG: string = 'stock_warehouse';

  async save(warehouse: StockWarehouse): Promise<void> {
    await this.repository.save(warehouse.values);
    this.invalidateCache();
  }

  async findById(id: string): Promise<StockWarehouse | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? StockWarehouse.restore(model) : null;
  }

  async findByCode(code: string): Promise<StockWarehouse | null> {
    const model = await this.repository.findOne({ where: { code: code.toUpperCase() } });
    return model ? StockWarehouse.restore(model) : null;
  }

  async findAll(): Promise<StockWarehouse[]> {
    const cacheKey = await this.getCacheKey(`all`);
    const cachedValue = await redisClient.get(cacheKey);
    if(cachedValue) {
      const cachedModels = JSON.parse(cachedValue);
      return cachedModels.map((model: StockWarehouseProps) => StockWarehouse.restore(model));
    }
    const models = await this.repository.find();
    await redisClient.set(cacheKey, JSON.stringify(models), {EX: this.TTL});
    return models.map(model => StockWarehouse.restore(model));
  }

  async findActive(): Promise<StockWarehouse[]> {
    const models = await this.repository.find({ where: { isActive: true } });
    return models.map(model => StockWarehouse.restore(model));
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.repository.count({ where: { code: code.toUpperCase() } });
    return count > 0;
  }
}
