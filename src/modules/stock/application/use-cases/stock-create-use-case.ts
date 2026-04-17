import { StockItem } from "@modules/stock/domain/entities/stock-item";
import type { StockItemCreateDTO } from "../dtos/stock-item-dtos";
import type { IStockItemRepository } from "../interfaces/repository/stock-item-repository-interface";
import { AppError } from "@shared/errors/AppError";

export class StockCreateItemUC {
  constructor(private readonly itemRepo: IStockItemRepository) {}

  async execute(props: StockItemCreateDTO): Promise<void> {
     const stockItem = StockItem.create(props.sku, props.warehouse_id, props.initial_quantity);
     try {
        await this.itemRepo.save(stockItem);
     } catch (error) {
        console.log(error)
        throw new AppError('Falha ao criar item de estoque');
     }
  }
}