import { Router } from "express";
import { CategoryController } from "../contrrollers/CategoryController";
import { saveCategorySchema, deleteCategorySchema, getCategorySchema, updateCategorySchema, getAllCategoriesInputSchema } from "../validation-schemas/category-schema";
import { TypeORMCategoryRepository } from "../../persistence/TypeORMCategoryRepository";
import { PinoLoggerAdapter } from "@shared/logger/PinoLoggerAdapter";
import { validate } from "@shared/middlewares/validator";

export const categoryRoutes = Router();
const controller = new CategoryController(
    new TypeORMCategoryRepository(),
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
 *   name: Categories
 *   description: Gerenciamento de categorias do catálogo
 * 
 * /catalog/api/v2/categories:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categories]
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
 *         description: Lista de categorias retornada com sucesso
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCategoriesDTO'
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryDTO'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryDTO'
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       409: 
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 * 
 * /catalog/api/v2/categories/{id}:
 *   get:
 *     summary: Obtém uma categoria pelo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryDTO'
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 *   patch:
 *     summary: Atualiza uma categoria existente
 *     tags: [Categories]
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
 *             $ref: '#/components/schemas/UpdateCategoryDTO'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryDTO'
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
 *     summary: Remove uma categoria
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Categoria removida com sucesso
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 */


categoryRoutes.get('/', validate(getAllCategoriesInputSchema), (req, res) => controller.all(req, res));

categoryRoutes.post('/', validate(saveCategorySchema), 
    (req, res) => controller.save(req, res)
);

categoryRoutes.get(
    '/:id', 
    validate(getCategorySchema), 
    (req, res) => controller.findById(req, res)
);

categoryRoutes.delete(
    '/:id', 
    validate(deleteCategorySchema),
    (req, res) => controller.delete(req, res)
);

categoryRoutes.patch(
    '/:id', validate(updateCategorySchema),
    (req, res) => controller.update(req, res)
);