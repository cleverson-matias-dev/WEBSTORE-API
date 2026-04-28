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
import { TypeOrmImageRepository } from "./infrastructure/persistence/TypeORMImagesRepository";
import { TypeOrmSkuRepository } from "./infrastructure/persistence/TypeORMSkuRepository";
import { TypeORMAttributeRepository } from "./infrastructure/persistence/TypeORMAttributeRepository";
import { StockServiceAdapter } from "./infrastructure/external-services/stock-adapter-service";

export class CatalogModule {
  private static _productController: ProductController;

  static async setup(): Promise<void> {
    // 1. Infraestrutura e Adaptadores
    const repository = new TypeormProductRepository();
    const categoryRepo = new TypeORMCategoryRepository();
    const imageRepo = new TypeOrmImageRepository();
    const skuRepo = new TypeOrmSkuRepository();
    const attrRepo = new TypeORMAttributeRepository();
    const stockService = new StockServiceAdapter(StockModule.getFacade());
    const messageBroker = RabbitMQServer.getInstance();

    // 2. Injeção de Dependências no Controller
    this._productController = new ProductController(
      new CreateProductUseCase(repository, categoryRepo, skuRepo, imageRepo, attrRepo, messageBroker),
      new ListProductsUseCase(repository, stockService),
      new GetProductUseCase(repository),
      new UpdateProductUseCase(repository, categoryRepo),
      new DeleteProductUseCase(repository)
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
}
