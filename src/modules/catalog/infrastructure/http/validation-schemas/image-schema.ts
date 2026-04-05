import z from 'zod';

export const getAllImagesSchema = z.object({
    query: z.object({
        limit: z.string().optional(),
        page: z.string().optional()
    })
})
export type GetAllImagesSchema = z.infer<typeof getAllImagesSchema>['query']

export const saveImageSchema = z.object({
    body: z.object({
        product_id: z.uuid({message: 'id do produto não é uuid válido'}),
        url: z.string(),
        ordem: z.number().optional()
    })
});
export type SaveImageSchema = z.infer<typeof saveImageSchema>['body'];

export const updateImageSchema = z.object({
    body: z.object({
        url: z.string({message:"url não valida"}).optional(),
        ordem: z.string("ordem não valida").optional()
    }),
    params: z.object({
        id: z.uuid({error:'Uuid não é válido'}),
    })
});
export type UpdateImageSchema = z.infer<typeof updateImageSchema>['body'];

export const getImageSchema = z.object({
    params: z.object({
        id: z.uuid({error: 'Uuid não é válido.'})
    })
})
export type GetImageSchema = z.infer<typeof getImageSchema>['params'];


export const deleteImageSchema = z.object({
    params: z.object({
        id: z.uuid({error: 'Uuid não é válido.'})
    })
})
export type DeleteImageSchema = z.infer<typeof deleteImageSchema>['params'];

