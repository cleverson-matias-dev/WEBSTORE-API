import { Router } from "express";
import { StockCmsController } from "../contrrollers/stock-cms-controller";
import { StockStoreController } from "../contrrollers/stock-store-controller";
import { CmsStockUseCases } from "@modules/stock/application/use-cases/stock-cms-use-cases";
import { TypeOrmStockItemRepository } from "../../persistence/stock-items-repository-adapter";
import { StockWarehouseUseCases } from "@modules/stock/application/use-cases/stock-warehouse-use-cases";
import { TypeOrmStockWarehouseRepository } from "../../persistence/stock-warehouse-repository-adapter";
import { StoreStockUseCases } from "@modules/stock/application/use-cases/stock-store-use-cases";
import { TypeOrmStockReservationRepository } from "../../persistence/stock-reservation-repository-adapter";
import { authorize, UserRole } from "@shared/middlewares/authorization-middleware";
import { validate } from "@shared/middlewares/validator";
import { AdjustStockSchema, CheckAvailabilitySchema, CreateWarehouseSchema, GetDetailsSchema, ReserveStockSchema } from "../validation-schemas/stock-request-validation";

const stockRoutes = Router();
const cmsUseCases = new CmsStockUseCases(new TypeOrmStockItemRepository());
const warehouseUseCases = new StockWarehouseUseCases(new TypeOrmStockWarehouseRepository());
const cmsController = new StockCmsController(cmsUseCases, warehouseUseCases);
const storeUseCases = new StoreStockUseCases(new TypeOrmStockItemRepository(), new TypeOrmStockReservationRepository())
const storeController = new StockStoreController(storeUseCases);

stockRoutes.get('/v1/availability',
    authorize([UserRole.ADMIN, UserRole.CLIENT]),
    validate(CheckAvailabilitySchema),
    (req, res) => storeController.checkAvailability(req, res));
stockRoutes.post('/v1/reserve',
    authorize([UserRole.ADMIN, UserRole.CLIENT]),
    validate(ReserveStockSchema),
    (req, res) => storeController.reserve(req, res));
stockRoutes.post('/v1/adjust', 
    authorize([UserRole.ADMIN]),
    validate(AdjustStockSchema),
    (req, res) => cmsController.adjust(req, res));
stockRoutes.post('/v1/warehouses', 
    authorize([UserRole.ADMIN]),
    validate(CreateWarehouseSchema),
    (req, res) => cmsController.createWarehouse(req, res));
stockRoutes.get('/v1/details/:sku', 
    authorize([UserRole.ADMIN, UserRole.CLIENT]),
    validate(GetDetailsSchema),
    (req, res) => cmsController.getDetails(req, res));
stockRoutes.get('/v1/warehouses', 
    authorize([UserRole.ADMIN, UserRole.CLIENT]),
    (req, res) => cmsController.listWarehouses(req, res));

export { stockRoutes };
