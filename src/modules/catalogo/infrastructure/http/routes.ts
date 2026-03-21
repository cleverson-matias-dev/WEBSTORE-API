import { Router } from "express";
import { attributeRoutes } from "./routes/attribute-routes";
import { categoryRoutes } from "./routes/category-routes";

const catalogoRoutes = Router();

catalogoRoutes.use('/categories', categoryRoutes);
catalogoRoutes.use('/attributes', attributeRoutes)

export default catalogoRoutes;