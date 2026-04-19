import type { StockItem } from "@modules/stock/domain/entities/stock-item";

export interface IStockItemRepository {
  findBySkuAndWarehouse(sku: string, warehouseId: string): Promise<StockItem | null>;
  findAllBySku(sku: string): Promise<StockItem[]>;
  save(stockItem: StockItem): Promise<void>;
  findByIds(ids: string[]): Promise<StockItem[]>;
  exists(sku: string, warehouseId: string): Promise<boolean>;
}
