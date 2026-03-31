import { Router } from "express";
import { attributeRoutes } from "./attribute-routes";
import { categoryRoutes } from "./category-routes";
import { imagesRoutes } from "./image-routes";
import { productRoutes } from "./product-routes";
import { skuRoutes } from "./sku-routes";

const catalogoRoutes = Router();

catalogoRoutes.use('/v1/categories', categoryRoutes);
catalogoRoutes.use('/v1/attributes', attributeRoutes);
catalogoRoutes.use('/v1/images', imagesRoutes);
catalogoRoutes.use('/v1/products', productRoutes);
catalogoRoutes.use('/v1/skus', skuRoutes);

export default catalogoRoutes;