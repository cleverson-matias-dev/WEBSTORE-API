import { Router } from "express";
import { CategoryController } from "../contrrollers/CategoryController";
import { saveCategorySchema, deleteCategorySchema, getCategorySchema, updateCategorySchema, getAllCategoriesInputSchema } from "../validation-schemas/category-schema";
import { TypeORMCategoryRepository } from "../../persistence/TypeORMCategoryRepository";
import { PinoLoggerAdapter } from "@shared/logger/PinoLoggerAdapter";
import { validate } from "@shared/middlewares/validator";
import { TypeormProductRepository } from "../../persistence/TypeORMProductRepository";
import { authorize, UserRole } from "@shared/middlewares/authorization-middleware";

export const categoryRoutes = Router();
const controller = new CategoryController(
    new TypeormProductRepository(),
    new TypeORMCategoryRepository(),
    new PinoLoggerAdapter()
);



categoryRoutes.get('/', validate(getAllCategoriesInputSchema), (req, res) => controller.all(req, res));

categoryRoutes.post('/', 
    authorize([UserRole.ADMIN]), 
    validate(saveCategorySchema), 
    (req, res) => controller.save(req, res)
);

categoryRoutes.get(
    '/:id', 
    validate(getCategorySchema), 
    (req, res) => controller.findById(req, res)
);

categoryRoutes.delete(
    '/:id', 
    authorize([UserRole.ADMIN]),
    validate(deleteCategorySchema),
    (req, res) => controller.delete(req, res)
);

categoryRoutes.patch(
    '/:id', validate(updateCategorySchema),
    authorize([UserRole.ADMIN]),
    (req, res) => controller.update(req, res)
);