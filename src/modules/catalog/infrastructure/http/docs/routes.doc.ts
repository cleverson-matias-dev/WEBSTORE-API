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
 * /catalog/api/v2/attributes:
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
 * /catalog/api/v2/attributes/{id}:
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

