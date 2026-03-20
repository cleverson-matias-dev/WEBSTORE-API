import { Router } from "express";
import { attributeRoutes } from "./routes/attribute-routes";
import { categoryRoutes } from "./routes/category-routes";

const routes = Router();

routes.use('/categories', categoryRoutes);
routes.use('/attributes', attributeRoutes)

export default routes;