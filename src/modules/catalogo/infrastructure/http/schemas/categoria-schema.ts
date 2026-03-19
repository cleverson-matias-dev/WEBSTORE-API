import z from 'zod';

export const createCategoriaSchema = z.object({
    body: z.object({
        nome: z.string().min(3, 'Categoria precisa ter no mínimo 3 caracteres'),
        parent_id: z.union([
            z.uuid({error:'Uuid não é válido'}),
            z.literal('')
        ])
    })
});
export type CreateCategoriaSchema = z.infer<typeof createCategoriaSchema>['body'];

export const editCategoriaSchema = z.object({
    body: z.object({
        nome: z.string().min(3, 'Categoria precisa ter no mínimo 3 caracteres'),
    }),
    params: z.object({
        id: z.uuid({error:'Uuid não é válido'})
    })
});
export type EditCategoriaSchema = z.infer<typeof editCategoriaSchema>['body'];

export const getDeleteCategoriaSchema = z.object({
    params: z.object({
        id: z.uuid({error: 'Uuid não é válido.'})
    })
})
export type GetDeleteCategoriaSchema = z.infer<typeof getDeleteCategoriaSchema>['params'];


