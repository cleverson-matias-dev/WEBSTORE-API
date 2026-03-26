
import { Router } from "express";
import { PinoLoggerAdapter } from "@shared/logger/PinoLoggerAdapter";
import { validate } from "@shared/middlewares/validator";
import { ImagesController } from "../contrrollers/ImagesController";
import { TypeORMImageRepository } from "../../persistence/TypeORMImagesRepository";
import { deleteImageSchema, getAllImagesSchema, getImageSchema, saveImageSchema, updateImageSchema } from "../validation-schemas/image-schema";

export const imagesRoutes = Router();
const controller = new ImagesController(
    new TypeORMImageRepository(),
    new PinoLoggerAdapter()
);

imagesRoutes.get('/', validate(getAllImagesSchema), (req, res) => controller.all(req, res));

imagesRoutes.post('/', validate(saveImageSchema), 
    (req, res) => controller.save(req, res)
);

imagesRoutes.get(
    '/:id', 
    validate(getImageSchema), 
    (req, res) => controller.findById(req, res)
);

imagesRoutes.delete(
    '/:id', 
    validate(deleteImageSchema),
    (req, res) => controller.delete(req, res)
);

imagesRoutes.patch(
    '/:id', validate(updateImageSchema),
    (req, res) => controller.update(req, res)
);