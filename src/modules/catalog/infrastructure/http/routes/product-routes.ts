import { Router } from "express";
import { TypeormProductRepository } from "../../persistence/TypeORMProductRepository";
import { ProductController } from "../contrrollers/ProductController"; 
import { 
  CreateProductUseCase, 
  DeleteProductUseCase, 
  GetProductUseCase, 
  ListProductsUseCase, 
  UpdateProductUseCase 
} from "@modules/catalog/application/use-cases/product-use-cases";
import { validate } from "@shared/middlewares/validator";
import { 
  createProductSchema, 
  filterProductSchema, 
  paramsUuidSchema, 
  updateProductSchema 
} from "../validation-schemas/product-schema";
import { TypeORMCategoryRepository } from "../../persistence/TypeORMCategoryRepository";
import { authorize, UserRole } from "@shared/middlewares/authorization-middleware";
import { StockServiceAdapter } from "../../external-services/stock-adapter-service";
import { StockModule } from "@modules/stock/stock.module";
import { TypeOrmImageRepository } from "../../persistence/TypeORMImagesRepository";
import { TypeOrmSkuRepository } from "../../persistence/TypeORMSkuRepository";
import { TypeORMAttributeRepository } from "../../persistence/TypeORMAttributeRepository";
import RabbitMQServer from "@shared/infra/messaging/RabbitMQServer";

const productRoutes = Router();

const getController = () => {
  const repository = new TypeormProductRepository();
  const categoryRepo = new TypeORMCategoryRepository();
  const stockService = new StockServiceAdapter(StockModule.getFacade());
  const imageRepository = new TypeOrmImageRepository();
  const skuRepository = new TypeOrmSkuRepository();
  const attibutesRepository = new TypeORMAttributeRepository();
  const messageBroker = RabbitMQServer.getInstance();

  return new ProductController(
    new CreateProductUseCase(
      repository, 
      categoryRepo, 
      skuRepository, 
      imageRepository, 
      attibutesRepository,
      messageBroker
    ),
    new ListProductsUseCase(repository, stockService),
    new GetProductUseCase(repository),
    new UpdateProductUseCase(repository, categoryRepo),
    new DeleteProductUseCase(repository)
  );
};

productRoutes.post("/", 
  authorize([UserRole.ADMIN]), 
  validate(createProductSchema), 
  (req, res) => getController().create(req, res)
);

productRoutes.get("/", 
  validate(filterProductSchema), 
  (req, res) => getController().list(req, res)
);

productRoutes.get("/:id", 
  validate(paramsUuidSchema), 
  (req, res) => getController().getById(req, res)
);

productRoutes.patch("/:id", 
  authorize([UserRole.ADMIN]), 
  validate(paramsUuidSchema),
  validate(updateProductSchema),
  (req, res) => getController().update(req, res)
);

productRoutes.delete("/:id", 
  authorize([UserRole.ADMIN]), 
  validate(paramsUuidSchema), 
  (req, res) => getController().delete(req, res)
);

export { productRoutes };
