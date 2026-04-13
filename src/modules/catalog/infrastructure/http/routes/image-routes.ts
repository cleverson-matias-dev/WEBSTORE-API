import { Router } from 'express';
import { ImageController } from '../contrrollers/ImagesController';
import { TypeOrmImageRepository } from '../../persistence/TypeORMImagesRepository';
import { CreateImageUseCase, DeleteImageUseCase, GetImageByIdUseCase, ListImagesUseCase, UpdateImageUseCase } from '@modules/catalog/application/use-cases/image-use-cases';
import { getAllImagesSchema, getImageSchema, saveImageSchema, updateImageSchema } from '../validation-schemas/image-schema';
import { validate } from '@shared/middlewares/validator';
import { TypeormProductRepository } from '../../persistence/TypeORMProductRepository';
import { authorize, UserRole } from '@shared/middlewares/authorization-middleware';

export const imagesRoutes = Router();

const typeormRepo = new TypeOrmImageRepository();
const productRepo = new TypeormProductRepository();
const createUC = new CreateImageUseCase(typeormRepo, productRepo);
const getByIdUC = new GetImageByIdUseCase(typeormRepo);
const listUC = new ListImagesUseCase(typeormRepo);
const updateUC = new UpdateImageUseCase(typeormRepo);
const deleteUC = new DeleteImageUseCase(typeormRepo);

const imageController = new ImageController(createUC, getByIdUC, listUC, updateUC, deleteUC);

imagesRoutes.post(
  '/', 
  authorize([UserRole.ADMIN]),
  validate(saveImageSchema), 
  (req, res) => imageController.create(req, res)
);

imagesRoutes.get(
  '/:id', 
  validate(getImageSchema), 
  (req, res) => imageController.findById(req, res)
);

imagesRoutes.get(
  '/', 
  validate(getAllImagesSchema), 
  (req, res) => imageController.index(req, res)
);

imagesRoutes.put(
  '/:id', 
  authorize([UserRole.ADMIN]),
  validate(updateImageSchema), 
  (req, res) => imageController.update(req, res)
);

imagesRoutes.delete(
  '/:id', 
  authorize([UserRole.ADMIN]),
  validate(getImageSchema), 
  (req, res) => imageController.delete(req, res)
);

