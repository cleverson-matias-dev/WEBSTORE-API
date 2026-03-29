import z from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        name: z.string({message: 'nome é obrigatório'}).min(2, 'mínimo 2 caracteres'),
        description: z.string().min(2).min(2, 'mínimo 2 caracteres'),
        category_id: z.uuid()
    })
})
export type CreateProductSchema = z.infer<typeof createProductSchema>['body'];

export const filterProductSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
    })
})
export type FilterProductSchema = z.infer<typeof filterProductSchema>['query'];

export const paramsUuidSchema = z.object({
    params: z.object({
        id: z.uuid({message: 'Uuid não é valido'})
    })
})
export type ParamsUuidSchema = z.infer<typeof paramsUuidSchema>['params'];

