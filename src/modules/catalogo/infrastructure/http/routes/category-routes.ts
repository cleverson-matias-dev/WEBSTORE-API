import { Router } from "express";
import { CategoryController } from "../contrrollers/CategoryController";
import { validate } from "../../../../../shared/middlewares/validator";
import { saveCategorySchema, deleteCategorySchema, getCategorySchema, updateCategorySchema, getAllCategoriesInputSchema } from "../validation-schemas/category-schema";

export const categoryRoutes = Router();
const controller = new CategoryController();

categoryRoutes.get('/', validate(getAllCategoriesInputSchema), (req, res) => controller.all(req, res));

categoryRoutes.post('/', validate(saveCategorySchema), 
    (req, res) => controller.save(req, res)
);

categoryRoutes.get(
    '/:id', 
    validate(getCategorySchema), 
    (req, res) => controller.findById(req, res)
);

categoryRoutes.delete(
    '/:id', 
    validate(deleteCategorySchema),
    (req, res) => controller.delete(req, res)
);

categoryRoutes.patch(
    '/:id', validate(updateCategorySchema),
    (req, res) => controller.update(req, res)
);