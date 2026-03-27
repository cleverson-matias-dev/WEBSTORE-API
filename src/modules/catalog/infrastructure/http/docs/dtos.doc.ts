/**
 * @openapi
 * components:
 *   schemas:
 *     AttributeDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: fec56a31-eaa4-4825-bd1c-58499d4386d9
 *         name:
 *           type: string
 *           example: Cor
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2026-03-23T12:41:26.431Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: 2026-03-23T12:41:26.431Z
 *
 *     CreateAttributeDTO:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Tamanho
 *
 *     UpdateAttributeDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Voltagem
 *
 *     GetAllAttributesInputDTO:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           maximum: 100
 *           default: 10
 *         name:
 *           type: string
 *           description: Filtro opcional por nome do atributo
 *
 *     PaginatedAttributesDTO:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttributeDTO'
 *         total:
 *           type: integer
 *           example: 50
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CategoryDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: a1b2c3d4-e5f6-4a5b-8c9d-0e1f2g3h4i5j
 *         name:
 *           type: string
 *           example: Eletrônicos
 *         slug:
 *           type: string
 *           example: eletronicos
 *         parent_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: null
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2026-03-24T18:14:26.431Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: 2026-03-24T18:14:26.431Z
 *
 *     CreateCategoryDTO:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Smartphones
 *         parent_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: a1b2c3d4-e5f6-4a5b-8c9d-0e1f2g3h4i5j
 *         slug:
 *           type: string
 *           example: smartphones
 *
 *     UpdateCategoryDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Smartphones e Acessórios
 *
 *     GetAllCategoriesInputDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Filtro opcional por nome da categoria
 *         limit:
 *           type: integer
 *           default: 10
 *         page:
 *           type: integer
 *           default: 1
 *
 *     PaginatedCategoriesDTO:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryDTO'
 *         total:
 *           type: integer
 *           example: 25
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 */

