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

export interface CreateCategoryDTO {
    name: string;
    parent_id?: string | null;
    slug?: string;
}

export interface UpdateCategoryDTO {
    name: string;
}

export interface CategoryDTO {
    id: string;
    name: string;
    slug: string;
    parent_id?: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface GetAllCategoriesInputDTO {
    name?: string,
    limit?: number,
    page?: number
}

export interface PaginatedCategoriesDTO {
    items: CategoryDTO[],
    total: number,
    page: number,
    limit: number
}