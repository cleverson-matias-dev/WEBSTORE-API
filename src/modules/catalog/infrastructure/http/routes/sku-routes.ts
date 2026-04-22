import { SkuUseCases } from "@modules/catalog/application/use-cases/sku-use-cases";
import { Request, Response, Router } from "express";
import { SkuController } from "../contrrollers/SkuController";
import { validate } from "@shared/middlewares/validator";
import { createSkuSchema, paramProductUuidSchema, paramUuidSchema, skuPriceUpdateSchema } from "../validation-schemas/sku-schemas";
import { TypeOrmSkuRepository } from "../../persistence/TypeORMSkuRepository";
import { TypeormProductRepository } from "../../persistence/TypeORMProductRepository";
import { authorize, UserRole } from "@shared/middlewares/authorization-middleware";
import { StockServiceAdapter } from "../../external-services/stock-adapter-service";
import { StockModule } from "@modules/stock/stock.module";

const skuRoutes = Router();

const skuRepository = new TypeOrmSkuRepository();
const productRepository = new TypeormProductRepository();
const stockService = new StockServiceAdapter(StockModule.getFacade());
const skuUseCases = new SkuUseCases(skuRepository, productRepository, stockService);
const skuController = new SkuController(skuUseCases);

skuRoutes.post(
  '/',
  authorize([UserRole.ADMIN]),
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
  authorize([UserRole.ADMIN]),
  validate(skuPriceUpdateSchema),
  (req: Request, res: Response) => skuController.updatePrice(req, res)
);

skuRoutes.patch(
  '/:id/logistics',
  authorize([UserRole.ADMIN]),
  validate(paramUuidSchema),
  (req: Request, res: Response) => skuController.updateLogistics(req, res)
);

skuRoutes.delete(
  '/:id',
  authorize([UserRole.ADMIN]),
  validate(paramUuidSchema),
  (req: Request, res: Response) => skuController.delete(req, res)
);

export { skuRoutes };
