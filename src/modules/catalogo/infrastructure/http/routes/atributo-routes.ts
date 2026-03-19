import { Router } from "express";
import { validate } from "../middlewares/validate";
import { AttributesController } from "../AttributesController";
import { createAtributoSchema, editAtributoSchema, getDeleteAtributoSchema } from "../schemas/atributo-schema";

export const attributeRoutes = Router();
const attributesController = new AttributesController();

attributeRoutes.get('/', (req, res) => attributesController.all(req, res));

attributeRoutes.post(
    '/', 
    validate(createAtributoSchema), 
    (req, res) => attributesController.create(req, res)
);

attributeRoutes.get(
    '/:id', 
    validate(getDeleteAtributoSchema), 
    (req, res) => attributesController.find(req, res)
);

attributeRoutes.delete(
    '/:id', 
    validate(getDeleteAtributoSchema),
    (req, res) => attributesController.delete(req, res)
);

attributeRoutes.patch(
    '/', validate(editAtributoSchema),
    (req, res) => attributesController.update(req, res)
);