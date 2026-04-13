import { SkuAttributeValueService } from '@modules/catalog/application/use-cases/sku-attribute-value-use-cases';
import { Router } from 'express';
import { SkuAttributeValueController } from '../contrrollers/SkuAttributeValueController';
import { ISkuAttributeValueRepository } from '@modules/catalog/application/interfaces/repository/ISkuAttributeValueRepository';
import { TypeOrmSkuAttributeValueRepository } from '../../persistence/TypeOrmSkuAttributeValueRepository';
import { validate } from '@shared/middlewares/validator';
import { attributeSkuIdValueParamUuidSchema, attributeValueIdParamUuidSchema, createAtributeValueSchema, uuidParamUuidSchema } from '../validation-schemas/sku-attribute-value-schemas';
import { authorize, UserRole } from '@shared/middlewares/authorization-middleware';

export const skuAttributeRoutes = Router();

const repository: ISkuAttributeValueRepository = new TypeOrmSkuAttributeValueRepository();
const service = new SkuAttributeValueService(repository);
const controller = new SkuAttributeValueController(service);

skuAttributeRoutes.post(
    '/',
    authorize([UserRole.ADMIN]),
    validate(createAtributeValueSchema),
    (req, res) => controller.create(req, res)
);

skuAttributeRoutes.get(
    '/sku/:skuId',
    validate(attributeSkuIdValueParamUuidSchema),
    (req, res) => controller.listBySku(req, res)
);

skuAttributeRoutes.put(
    '/:id',
    authorize([UserRole.ADMIN]),
    validate(attributeValueIdParamUuidSchema),
    (req, res) => controller.update(req, res)
);

skuAttributeRoutes.delete(
    '/:id',
    authorize([UserRole.ADMIN]),
    validate(uuidParamUuidSchema),
    (req, res) => controller.delete(req, res)
);
