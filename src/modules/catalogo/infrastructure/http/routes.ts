import { Router } from "express";
import { CategoryController } from "./CategoryController";

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.post('/', (req, res) => categoryController.create(req, res));
categoryRoutes.get('/', (req, res) => categoryController.all(req, res));
categoryRoutes.get('/:id', (req, res) => categoryController.find(req, res));
categoryRoutes.delete('/:id', (req, res) => categoryController.delete(req, res));
categoryRoutes.patch('/', (req, res) => categoryController.update(req, res));

export default categoryRoutes;