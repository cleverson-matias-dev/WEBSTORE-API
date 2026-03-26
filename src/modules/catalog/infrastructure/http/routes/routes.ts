import { Router } from "express";
import { attributeRoutes } from "./attribute-routes";
import { categoryRoutes } from "./category-routes";
import { imagesRoutes } from "./image-routes";

const catalogoRoutes = Router();

catalogoRoutes.use('/v1/categories', categoryRoutes);
catalogoRoutes.use('/v1/attributes', attributeRoutes);
catalogoRoutes.use('/v1/images', imagesRoutes);

export default catalogoRoutes;