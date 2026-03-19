import { Router } from "express";
import { attributeRoutes } from "./routes/atributo-routes";
import { categoryRoutes } from "./routes/categoria-routes";

const routes = Router();

routes.use('/categorias', categoryRoutes);
routes.use('/atributos', attributeRoutes)

export default routes;