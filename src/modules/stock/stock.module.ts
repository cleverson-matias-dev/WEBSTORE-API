import { CmsStockUseCases } from "./application/use-cases/stock-cms-use-cases";
import { StockCreateItemUC } from "./application/use-cases/stock-create-use-case";
import { SkuSubscriber } from "./infrastructure/messaging/sku-subscribers";
import { TypeOrmStockItemRepository } from "./infrastructure/persistence/stock-items-repository-adapter";
import { StockModuleFacade } from "./ui/inventory.facade";

export class StockModule {

  static getFacade() {
    const repository = new TypeOrmStockItemRepository();
    const useCases = new CmsStockUseCases(repository);
    return new StockModuleFacade(useCases);
  }

  static async setup() {
    const itemRepository = new TypeOrmStockItemRepository();
    const stockUseCase = new StockCreateItemUC(itemRepository);
    const stockSubscriber = new SkuSubscriber(stockUseCase);
    
    await stockSubscriber.execute();
    console.log("✅ Stock Module: Subscribers ativos");
  }

}