import { Router } from "express";
import { validate } from "../../../../../shared/middlewares/validator";
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
 *         description: Filtra atributos pelo nome
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de registros por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numero da página atual
 *     responses:
 *       200:
 *         description: Lista de atributos retornada com sucesso
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAttributesDTO'
 *       400:
 *         description: Erro na requisição (parâmetros inválidos)
 *       500:
 *         description: Erro interno do servidor
 *
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
 *       404:
 *         description: Atributo não encontrado
 * 
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