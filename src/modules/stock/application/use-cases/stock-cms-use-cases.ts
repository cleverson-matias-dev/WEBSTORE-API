import { AppError } from "@shared/errors/AppError";
import type { IStockItemRepository } from "../interfaces/repository/stock-item-repository-interface";
import type { AdjustStockInputDTO, StockDetailOutputDTO } from "../dtos/stock-item-dtos";
import type { StockItem } from "@modules/stock/domain/entities/stock-item";

export class CmsStockUseCases {
  constructor(private readonly itemRepo: IStockItemRepository) {}

  // Ajuste manual (ex: quebra de mercadoria ou correção de inventário)
  async adjustQuantity(input: AdjustStockInputDTO): Promise<void> {
    const item = await this.itemRepo.findBySkuAndWarehouse(input.sku, input.warehouseId);
    if (!item) throw new AppError("Item não encontrado para ajuste.", 404);

    // Se amount for negativo, subtrai. Se positivo, soma.
    item.adjustQuantity(input.amount);
    
    // Dica: Aqui você poderia disparar um evento "StockAdjusted" para auditoria
    await this.itemRepo.save(item);
  }

  async getBySkuList(skus: string[]): Promise<StockItem[]> {
    return this.itemRepo.findAllBySkuList(skus);
  }

  // Detalhes completos para a tela de gerenciar estoque
  async getStockDetails(sku: string): Promise<StockDetailOutputDTO[]> {
    const items = await this.itemRepo.findAllBySku(sku);
    
    return items.map(item => ({
      sku: item.values.sku,
      warehouseId: item.values.warehouseId,
      onHand: item.values.quantityOnHand,
      reserved: item.values.quantityReserved,
      available: item.quantityAvailable
    }));
  }
}
