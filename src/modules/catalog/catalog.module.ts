import { StockModule } from "@modules/stock/stock.module";
import RabbitMQServer from "@shared/infra/messaging/RabbitMQServer";
import { 
  CreateProductUseCase, 
  DeleteProductUseCase, 
  GetProductUseCase, 
  ListProductsUseCase, 
  UpdateProductUseCase 
} from "./application/use-cases/product-use-cases";
import { ProductController } from "./infrastructure/http/contrrollers/ProductController";
import { TypeormProductRepository } from "./infrastructure/persistence/TypeORMProductRepository";
import { TypeORMCategoryRepository } from "./infrastructure/persistence/TypeORMCategoryRepository";
import { TypeOrmSkuRepository } from "./infrastructure/persistence/TypeORMSkuRepository";
import { TypeORMAttributeRepository } from "./infrastructure/persistence/TypeORMAttributeRepository";
import { StockServiceAdapter } from "./infrastructure/external-services/stock-adapter-service";
import { CategoryController } from "./infrastructure/http/contrrollers/CategoryController";
import { DeleteCategoryUC, FindCategoryByIdUC, GetAllCategoriesUC, SaveCategoryUC, UpdateCategoryUC } from "./application/use-cases/category-use-cases";
import { TypeormUnitOfWork } from "./infrastructure/persistence/TypeOrmUnitOfWork";
import { AppDataSource } from "@shared/infra/db/data-source";
import { TyepORMOutBoxRepository } from "./infrastructure/persistence/TypeORMOutboxRepository";

export class CatalogModule {
  private static _productController: ProductController;
  private static _categoryController: CategoryController;

  static async setup(): Promise<void> {
    // 1. Infraestrutura e Adaptadores
    const productRepository = new TypeormProductRepository();
    const categoryRepo = new TypeORMCategoryRepository();
    const skuRepo = new TypeOrmSkuRepository();
    const attrRepo = new TypeORMAttributeRepository();
    const stockService = new StockServiceAdapter(StockModule.getFacade());
    const messageBroker = RabbitMQServer.getInstance();
    const unitOfWork = new TypeormUnitOfWork(AppDataSource);
    const outboxRepository = new TyepORMOutBoxRepository();

    // 2. Injeção de Dependências no Controller
    this._productController = new ProductController(
      new CreateProductUseCase(
        productRepository, 
        categoryRepo, 
        skuRepo, 
        attrRepo, 
        messageBroker, 
        unitOfWork,
        outboxRepository),
      new ListProductsUseCase(productRepository, stockService),
      new GetProductUseCase(productRepository),
      new UpdateProductUseCase(productRepository, categoryRepo),
      new DeleteProductUseCase(productRepository)
    );

    this._categoryController = new CategoryController(
      new SaveCategoryUC(categoryRepo),
      new GetAllCategoriesUC(categoryRepo),
      new FindCategoryByIdUC(categoryRepo),
      new DeleteCategoryUC(categoryRepo, productRepository),
      new UpdateCategoryUC(categoryRepo)
    );

    console.log("📦 Catalog Module: Initialized");
  }

  // Getter profissional para as rotas consumirem
  static get productController(): ProductController {
    if (!this._productController) {
      throw new Error("CatalogModule not initialized. Call setup() first.");
    }
    return this._productController;
  }

  static get categoryController(): CategoryController {
    if (!this._productController) {
      throw new Error("CatalogModule not initialized. Call setup() first.");
    }
    return this._categoryController;
  }
}
