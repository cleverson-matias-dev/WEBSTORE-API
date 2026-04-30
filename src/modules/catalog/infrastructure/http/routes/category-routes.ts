import { Router } from "express";
import { saveCategorySchema, deleteCategorySchema, getCategorySchema, updateCategorySchema, getAllCategoriesInputSchema } from "../validation-schemas/category-schema";
import { validate } from "@shared/middlewares/validator";
import { authorize, UserRole } from "@shared/middlewares/authorization-middleware";
import { CatalogModule } from "@modules/catalog/catalog.module";

export const categoryRoutes = Router();

categoryRoutes.get('/', validate(getAllCategoriesInputSchema), (req, res) => CatalogModule.categoryController.all(req, res));

categoryRoutes.post('/', 
    authorize([UserRole.ADMIN]), 
    validate(saveCategorySchema), 
    (req, res) => CatalogModule.categoryController.save(req, res)
);

categoryRoutes.get(
    '/:id', 
    validate(getCategorySchema), 
    (req, res) => CatalogModule.categoryController.findById(req, res)
);

categoryRoutes.delete(
    '/:id', 
    authorize([UserRole.ADMIN]),
    validate(deleteCategorySchema),
    (req, res) => CatalogModule.categoryController.delete(req, res)
);

categoryRoutes.patch(
    '/:id', validate(updateCategorySchema),
    authorize([UserRole.ADMIN]),
    (req, res) => CatalogModule.categoryController.update(req, res)
);