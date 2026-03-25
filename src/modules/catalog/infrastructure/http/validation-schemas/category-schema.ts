import z from 'zod';

export const getAllCategoriesInputSchema = z.object({
    query: z.object({
        name: z.string().optional(),
        limit: z.string().optional(),
        page: z.string().optional()
    })
});
export type GetAllCategoriesInputSchema = z.infer<typeof getAllCategoriesInputSchema>['query']

export const saveCategorySchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Category precisa ter no mínimo 3 caracteres'),
        parent_id: z.union([
            z.uuid({error:'Uuid não é válido'}),
            z.literal('')
        ])
    })
});
export type CreateCategorySchema = z.infer<typeof saveCategorySchema>['body'];

export const updateCategorySchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Category precisa ter no mínimo 3 caracteres'),
    }),
    params: z.object({
        id: z.uuid({error:'Uuid não é válido'})
    })
});
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>['body'];

export const getCategorySchema = z.object({
    params: z.object({
        id: z.uuid({error: 'Uuid não é válido.'})
    })
})
export type GetCategorySchema = z.infer<typeof getCategorySchema>['params'];

export const deleteCategorySchema = z.object({
    params: z.object({
        id: z.uuid({error: 'Uuid não é válido.'})
    })
})
export type DeleteCategorySchema = z.infer<typeof deleteCategorySchema>['params'];


