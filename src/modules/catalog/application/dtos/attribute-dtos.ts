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

export interface PaginatedAttributesDTO {
    items: AttributeDTO[];
    total: number;
    page: number;
    limit: number;
}


export interface CreateAttributeDTO {
    name: string;
}

export interface UpdateAttributeDTO {
    name: string;
}

export interface AttributeDTO {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface GetAllAttributesInputDTO {
    page?: number,
    limit?: number,
    name?: string
}

export interface PaginatedAttributesDTO {
    items: AttributeDTO[],
    total: number,
    page: number,
    limit: number
}