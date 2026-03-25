import { Router } from "express";
import { attributeRoutes } from "./attribute-routes";
import { categoryRoutes } from "./category-routes";

const catalogoRoutes = Router();

catalogoRoutes.use('/v1/categories', categoryRoutes);
catalogoRoutes.use('/v1/attributes', attributeRoutes);

export default catalogoRoutes;