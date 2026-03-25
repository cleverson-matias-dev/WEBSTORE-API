import { Router } from "express";
import { validate } from "../../../../../shared/middlewares/validator-middleware";
import { AttributesController } from "../contrrollers/AttributesController";
import { saveAttributeSchema, deleteAttributeSchema, updateAttributeSchema, getAttributeSchema, getAllAttributesSchema } from "@modules/catalogo/infrastructure/http/validation-schemas/attribute-schema"
import { TypeORMAttributeRepository } from "../../persistence/TypeORMAttributeRepository";
import { PinoLoggerAdapter } from "@shared/logger/PinoLoggerAdapter";

export const attributeRoutes = Router();
const attributesController = new AttributesController(
    new TypeORMAttributeRepository(),
    new PinoLoggerAdapter()
);

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Mensagens de erro detalhadas aqui"]
 *   responses:
 *     StandardError:
 *       description: Resposta de erro padrão
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 * 
 * tags:
 *   name: Attributes
 *   description: Gerenciamento de atributos do catálogo
 * 
 * /api/attributes:
 *   get:
 *     summary: Lista todos os atributos
 *     tags: [Attributes]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Lista de atributos retornada com sucesso
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAttributesDTO'
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 *   post:
 *     summary: Cria um novo atributo
 *     tags: [Attributes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttributeDTO'
 *     responses:
 *       201:
 *         description: Atributo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributeDTO'
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       409: 
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 * 
 * /api/attributes/{id}:
 *   get:
 *     summary: Obtém um atributo pelo ID
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Atributo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributeDTO'
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 *   patch:
 *     summary: Atualiza um atributo existente
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAttributeDTO'
 *     responses:
 *       200:
 *         description: Atributo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributeDTO'
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 *       409:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 * 
 *   delete:
 *     summary: Remove um atributo
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Atributo removido com sucesso
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 */

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