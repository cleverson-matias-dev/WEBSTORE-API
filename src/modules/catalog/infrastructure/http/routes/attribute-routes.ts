import { Router } from "express";
import { validate } from "@shared/middlewares/validator"; 
import { AttributesController } from "../contrrollers/AttributesController";
import { saveAttributeSchema, deleteAttributeSchema, updateAttributeSchema, getAttributeSchema, getAllAttributesSchema } from "@modules/catalog/infrastructure/http/validation-schemas/attribute-schema"
import { TypeORMAttributeRepository } from "../../persistence/TypeORMAttributeRepository";
import { PinoLoggerAdapter } from "@shared/logger/PinoLoggerAdapter";
import { authorize, UserRole } from "@shared/middlewares/authorization-middleware";

export const attributeRoutes = Router();
const attributesController = new AttributesController(
    new TypeORMAttributeRepository(),
    new PinoLoggerAdapter()
);

attributeRoutes.get('/', validate(getAllAttributesSchema), (req, res) => attributesController.all(req, res));

attributeRoutes.post(
    '/',
    authorize([UserRole.ADMIN]),
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
    authorize([UserRole.ADMIN]),
    validate(deleteAttributeSchema),
    (req, res) => attributesController.delete(req, res)
);

attributeRoutes.patch(
    '/:id', validate(updateAttributeSchema),
    authorize([UserRole.ADMIN]),
    (req, res) => attributesController.update(req, res)
);