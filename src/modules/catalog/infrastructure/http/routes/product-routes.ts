import { Router } from "express";
import { TypeormProductRepository } from "../../persistence/TypeORMProductRepository";
import { ProductController } from "../contrrollers/ProductController"; 
import { CreateProductUseCase, DeleteProductUseCase, GetProductUseCase, ListProductsUseCase, UpdateProductUseCase } from "@modules/catalog/application/use-cases/product-use-cases";
import { validate } from "@shared/middlewares/validator";
import { createProductSchema, filterProductSchema, paramsUuidSchema } from "../validation-schemas/product-schema";
import { TypeORMCategoryRepository } from "../../persistence/TypeORMCategoryRepository";


const productRoutes = Router();

const repository = new TypeormProductRepository();
const categoryRepo = new TypeORMCategoryRepository();
const controller = new ProductController(
  new CreateProductUseCase(repository),
  new ListProductsUseCase(repository),
  new GetProductUseCase(repository),
  new UpdateProductUseCase(repository, categoryRepo),
  new DeleteProductUseCase(repository)
);

productRoutes.post("/", validate(createProductSchema), (req, res) => controller.create(req, res));
productRoutes.get("/", validate(filterProductSchema), (req, res) => controller.list(req, res));
productRoutes.get("/:id", validate(paramsUuidSchema), (req, res) => controller.getById(req, res));
productRoutes.put("/:id", validate(paramsUuidSchema), (req, res) => controller.update(req, res));
productRoutes.delete("/:id", validate(paramsUuidSchema), (req, res) => controller.delete(req, res));

export { productRoutes };
