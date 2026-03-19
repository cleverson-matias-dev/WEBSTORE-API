import z from 'zod';

export const createAtributoSchema = z.object({
    body: z.object({
        nome: z.string().min(3, 'Atributo precisa ter no mínimo 3 caracteres')
    })
});
export type CreateAtributoSchema = z.infer<typeof createAtributoSchema>['body'];

export const editAtributoSchema = z.object({
    body: z.object({
        nome: z.string().min(3, 'Atributo precisa ter no mínimo 3 caracteres'),
        id: z.uuid({error:'Uuid não é válido'})
    })
});
export type EditAtributoSchema = z.infer<typeof editAtributoSchema>['body'];

export const getDeleteAtributoSchema = z.object({
    params: z.object({
        id: z.uuid({error: 'Uuid não é válido.'})
    })
})
export type GetDeleteAtributoSchema = z.infer<typeof getDeleteAtributoSchema>['params'];


