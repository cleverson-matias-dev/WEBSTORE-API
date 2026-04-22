import { CmsStockUseCases } from "./application/use-cases/stock-cms-use-cases";
import { TypeOrmStockItemRepository } from "./infrastructure/persistence/stock-items-repository-adapter";
import { StockModuleFacade } from "./ui/inventory.facade";

// @modules/stock/stock.module.ts
export class StockModule {
  static getFacade() {
    const repository = new TypeOrmStockItemRepository();
    const useCases = new CmsStockUseCases(repository);
    return new StockModuleFacade(useCases);
  }
}