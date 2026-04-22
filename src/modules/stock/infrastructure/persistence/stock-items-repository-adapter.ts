import type { IStockItemRepository } from "@modules/stock/application/interfaces/repository/stock-item-repository-interface";
import { Repository, In } from "typeorm";
import { StockItemSchema } from "./entities/StockItemSchema";
import { StockItem } from "@modules/stock/domain/entities/stock-item";
import { AppDataSource } from "@shared/infra/db/data-source";

export class TypeOrmStockItemRepository implements IStockItemRepository {
  private repository: Repository<StockItemSchema> = AppDataSource.getRepository(StockItemSchema);

  async findAllBySkuList(skus: string[]): Promise<StockItem[]> {
      const models = await this.repository.find({where: {sku: In(skus)}});
      return models.map(model => StockItem.restore(model));
  }

  async findBySkuAndWarehouse(sku: string, warehouseId: string): Promise<StockItem | null> {
    const model = await this.repository.findOne({ where: { sku, warehouseId } });
    return model ? StockItem.restore(model) : null;
  }

  async findAllBySku(sku: string): Promise<StockItem[]> {
    const models = await this.repository.find({ where: { sku } });
    return models.map(model => StockItem.restore(model));
  }

  async save(stockItem: StockItem): Promise<void> {
    const data = stockItem.values;
    // Implementação de Optimistic Lock usando a version
    const result = await this.repository.save(data);
    if (!result) throw new Error("Erro ao persistir item de estoque.");
  }

  async findByIds(ids: string[]): Promise<StockItem[]> {
    const models = await this.repository.find({ where: { id: In(ids) } });
    return models.map(model => StockItem.restore(model));
  }

  async exists(sku: string, warehouseId: string): Promise<boolean> {
    const count = await this.repository.count({ where: { sku, warehouseId } });
    return count > 0;
  }
}
