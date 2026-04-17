import type { StockWarehouse } from "@modules/stock/domain/entities/stock-warehouse";

export interface IStockWarehouseRepository {

  save(warehouse: StockWarehouse): Promise<void>;
  findById(id: string): Promise<StockWarehouse | null>;
  findByCode(code: string): Promise<StockWarehouse | null>;
  findAll(): Promise<StockWarehouse[]>;
  findActive(): Promise<StockWarehouse[]>;
  existsByCode(code: string): Promise<boolean>;
}
