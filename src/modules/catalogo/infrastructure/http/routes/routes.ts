import { Router } from "express";
import { attributeRoutes } from "./attribute-routes";
import { categoryRoutes } from "./category-routes";

const catalogoRoutes = Router();

catalogoRoutes.use('/categories', categoryRoutes);
catalogoRoutes.use('/attributes', attributeRoutes);

export default catalogoRoutes;