import { SkuUseCases } from "@modules/catalog/application/use-cases/sku-use-cases";
import { Request, Response, Router } from "express";
import { SkuController } from "../contrrollers/SkuController";
import { validate } from "@shared/middlewares/validator";
import { createSkuSchema, paramProductUuidSchema, paramUuidSchema, skuPriceUpdateSchema } from "../validation-schemas/sku-schemas";
import { TypeOrmSkuRepository } from "../../persistence/TypeORMSkuRepository";
import { TypeormProductRepository } from "../../persistence/TypeORMProductRepository";


const skuRoutes = Router();

const skuRepository = new TypeOrmSkuRepository();
const productRepository = new TypeormProductRepository();
const skuUseCases = new SkuUseCases(skuRepository, productRepository);
const skuController = new SkuController(skuUseCases);

skuRoutes.post(
  '/',
  validate(createSkuSchema),
  (req: Request, res: Response) => skuController.create(req, res)
);

skuRoutes.get(
  '/product/:product_id',
  validate(paramProductUuidSchema),
  (req: Request, res: Response) => skuController.getByProductId(req, res)
);

skuRoutes.get(
  '/:id',
  validate(paramUuidSchema),
  (req: Request, res: Response) => skuController.getById(req, res)
);

skuRoutes.patch(
  '/:id/price',
  validate(skuPriceUpdateSchema),
  (req: Request, res: Response) => skuController.updatePrice(req, res)
);

skuRoutes.patch(
  '/:id/logistics',
  validate(paramUuidSchema),
  (req: Request, res: Response) => skuController.updateLogistics(req, res)
);

skuRoutes.delete(
  '/:id',
  validate(paramUuidSchema),
  (req: Request, res: Response) => skuController.delete(req, res)
);

export { skuRoutes };
