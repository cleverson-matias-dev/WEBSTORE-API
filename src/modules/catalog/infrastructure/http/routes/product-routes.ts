import { Router } from "express";
import { TypeormProductRepository } from "../../persistence/TypeORMProductRepository";
import { ProductController } from "../contrrollers/ProductController"; 
import { CreateProductUseCase, DeleteProductUseCase, GetProductUseCase, ListProductsUseCase, UpdateProductUseCase } from "@modules/catalog/application/use-cases/product-use-cases";
import { validate } from "@shared/middlewares/validator";
import { createProductSchema, filterProductSchema, paramsUuidSchema } from "../validation-schemas/product-schema";
import { TypeORMCategoryRepository } from "../../persistence/TypeORMCategoryRepository";
import { authorize, UserRole } from "@shared/middlewares/authorization-middleware";
import { StockServiceAdapter } from "../../external-services/stock-adapter-service";
import { StockModule } from "@modules/stock/stock.module";


const productRoutes = Router();

const repository = new TypeormProductRepository();
const categoryRepo = new TypeORMCategoryRepository();
const stockService = new StockServiceAdapter(StockModule.getFacade());
const controller = new ProductController(
  new CreateProductUseCase(repository, categoryRepo),
  new ListProductsUseCase(repository, stockService),
  new GetProductUseCase(repository),
  new UpdateProductUseCase(repository, categoryRepo),
  new DeleteProductUseCase(repository)
);

productRoutes.post("/", authorize([UserRole.ADMIN]), validate(createProductSchema), (req, res) => controller.create(req, res));
productRoutes.get("/", validate(filterProductSchema), (req, res) => controller.list(req, res));
productRoutes.get("/:id", validate(paramsUuidSchema), (req, res) => controller.getById(req, res));
productRoutes.put("/:id", authorize([UserRole.ADMIN]), validate(paramsUuidSchema), (req, res) => controller.update(req, res));
productRoutes.delete("/:id", authorize([UserRole.ADMIN]), validate(paramsUuidSchema), (req, res) => controller.delete(req, res));

export { productRoutes };
