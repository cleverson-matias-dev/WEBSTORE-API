import { Router } from "express";
import { CategoryController } from "../CategoryController";
import { validate } from "../middlewares/validate";
import { createCategoriaSchema, editCategoriaSchema, getDeleteCategoriaSchema } from "../schemas/categoria-schema";

export const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get('/', (req, res) => categoryController.all(req, res));

categoryRoutes.post(
    '/', 
    validate(createCategoriaSchema), 
    (req, res) => categoryController.create(req, res)
);

categoryRoutes.get(
    '/:id', 
    validate(getDeleteCategoriaSchema), 
    (req, res) => categoryController.find(req, res)
);

categoryRoutes.delete(
    '/:id', 
    validate(getDeleteCategoriaSchema),
    (req, res) => categoryController.delete(req, res)
);

categoryRoutes.patch(
    '/:id', validate(editCategoriaSchema),
    (req, res) => categoryController.update(req, res)
);