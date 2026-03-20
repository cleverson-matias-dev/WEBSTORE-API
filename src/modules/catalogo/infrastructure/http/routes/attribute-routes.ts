import { Router } from "express";
import { validate } from "../middlewares/validate";
import { AttributesController } from "../AttributesController";
import { saveAttributeSchema, deleteAttributeSchema, updateAttributeSchema, getAttributeSchema } from "@modules/catalogo/infrastructure/http/schemas/attribute-schema"

export const attributeRoutes = Router();
const attributesController = new AttributesController();

attributeRoutes.get('/', (req, res) => attributesController.all(req, res));

attributeRoutes.post(
    '/', 
    validate(saveAttributeSchema), 
    (req, res) => attributesController.save(req, res)
);

attributeRoutes.get(
    '/:id', 
    validate(getAttributeSchema), 
    (req, res) => attributesController.findById(req, res)
);

attributeRoutes.delete(
    '/:id', 
    validate(deleteAttributeSchema),
    (req, res) => attributesController.delete(req, res)
);

attributeRoutes.patch(
    '/:id', validate(updateAttributeSchema),
    (req, res) => attributesController.update(req, res)
);