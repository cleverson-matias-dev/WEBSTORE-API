import type { IStockService, SkuStock } from "@modules/catalog/application/interfaces/repository/stock-service.port";
import { StockModuleFacade, type StockPublicDTO } from "@modules/stock/ui/inventory.facade";

export class StockServiceAdapter implements IStockService {
  constructor(private inventoryFacade: StockModuleFacade) {}

  async getStocksBySkus(skus: string[]): Promise<SkuStock[]> {
    const data = await this.inventoryFacade.checkMultipleStocks(skus);
    
    return data.map((item: StockPublicDTO) => ({
      sku: item.sku,
      quantity: item.quantity
    }));
  }
  
}
