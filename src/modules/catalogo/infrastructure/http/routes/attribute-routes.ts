import { Router } from "express";
import { validate } from "../../../../../shared/middlewares/validator";
import { AttributesController } from "../contrrollers/AttributesController";
import { saveAttributeSchema, deleteAttributeSchema, updateAttributeSchema, getAttributeSchema, getAllAttributesSchema } from "@modules/catalogo/infrastructure/http/validation-schemas/attribute-schema"
import { TypeORMAttributeRepository } from "../../persistence/TypeORMAttributeRepository";
import { PinoLoggerAdapter } from "@shared/logger/PinoLoggerAdapter";

export const attributeRoutes = Router();
const repo = new TypeORMAttributeRepository();
const logger = new PinoLoggerAdapter();
const attributesController = new AttributesController(repo, logger);

attributeRoutes.get('/', validate(getAllAttributesSchema), (req, res) => attributesController.all(req, res));

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