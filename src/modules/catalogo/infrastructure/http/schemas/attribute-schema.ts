import z from 'zod';

export const saveAttributeSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Attribute precisa ter no mínimo 3 caracteres')
    })
});
export type CreateAttributeSchema = z.infer<typeof saveAttributeSchema>['body'];

export const updateAttributeSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Attribute precisa ter no mínimo 3 caracteres'),
    }),
    params: z.object({
        id: z.uuid({error:'Uuid não é válido'}),
    })
});
export type UpdateAttributeSchema = z.infer<typeof updateAttributeSchema>['body'];

export const getAttributeSchema = z.object({
    params: z.object({
        id: z.uuid({error: 'Uuid não é válido.'})
    })
})
export type GetAttributeSchema = z.infer<typeof getAttributeSchema>['params'];


export const deleteAttributeSchema = z.object({
    params: z.object({
        id: z.uuid({error: 'Uuid não é válido.'})
    })
})
export type DeleteAtributoSchema = z.infer<typeof deleteAttributeSchema>['params'];

