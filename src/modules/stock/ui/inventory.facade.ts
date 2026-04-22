import type { CmsStockUseCases } from "../application/use-cases/stock-cms-use-cases";
import type { StockItem } from "../domain/entities/stock-item";

export interface StockPublicDTO {
  sku: string;
  quantity: number;
}

export class StockModuleFacade {
  constructor(private stockCmsUseCases: CmsStockUseCases) {}

  async checkMultipleStocks(skus: string[]): Promise<StockPublicDTO[]> {
    const stockItems = await this.stockCmsUseCases.getBySkuList(skus);
    
    return stockItems.map((item: StockItem) => ({
      sku: item.values.sku,
      quantity: item.quantityAvailable
    }));
  }
  
}