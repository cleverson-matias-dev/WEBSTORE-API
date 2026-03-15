import { Router } from "express";
import { CategoryController } from "./CategoryController";

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.post('/', (req, res) => categoryController.create(req, res));

export default categoryRoutes;