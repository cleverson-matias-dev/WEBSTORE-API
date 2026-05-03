import { Router } from "express";
import { categoryRoutes } from "./category-routes";
import { productRoutes } from "./product-routes";

const catalogoRoutes = Router();

catalogoRoutes.use('/v1/categories', categoryRoutes);
catalogoRoutes.use('/v1/products', productRoutes);

export default catalogoRoutes;