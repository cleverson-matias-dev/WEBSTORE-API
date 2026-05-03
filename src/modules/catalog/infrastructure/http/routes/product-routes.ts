import { Router } from "express";
import { validate } from "@shared/middlewares/validator";
import { 
  createProductSchema, 
  filterProductSchema, 
  paramsUuidSchema, 
  updateProductSchema 
} from "../validation-schemas/product-schema";
import { authorize, UserRole } from "@shared/middlewares/authorization-middleware";
import { CatalogModule } from "@modules/catalog/catalog.module";

const productRoutes = Router();

productRoutes.post("/", 
  authorize([UserRole.ADMIN]), 
  validate(createProductSchema), 
  (req, res) => CatalogModule.productController.create(req, res)
);

productRoutes.get("/", 
  validate(filterProductSchema), 
  (req, res) => CatalogModule.productController.list(req, res)
);

productRoutes.get("/:id", 
  validate(paramsUuidSchema), 
  (req, res) => CatalogModule.productController.getById(req, res)
);

productRoutes.patch("/:id", 
  authorize([UserRole.ADMIN]), 
  validate(paramsUuidSchema),
  validate(updateProductSchema),
  (req, res) => CatalogModule.productController.update(req, res)
);

productRoutes.delete("/:id", 
  authorize([UserRole.ADMIN]), 
  validate(paramsUuidSchema), 
  (req, res) => CatalogModule.productController.delete(req, res)
);

export { productRoutes };
