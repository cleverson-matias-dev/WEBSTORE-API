import z from 'zod';

export const getAllImagesSchema = z.object({
    query: z.object({
        name: z.string().optional(),
        limit: z.string().optional(),
        page: z.string().optional()
    })
})
export type GetAllImagesSchema = z.infer<typeof getAllImagesSchema>['query']

export const saveImageSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Image precisa ter no mínimo 3 caracteres')
    })
});
export type CreateImageSchema = z.infer<typeof saveImageSchema>['body'];

export const updateImageSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Image precisa ter no mínimo 3 caracteres'),
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

