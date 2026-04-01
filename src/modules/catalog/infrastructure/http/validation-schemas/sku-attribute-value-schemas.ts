import z from 'zod';

export const createAtributeValueSchema = z.object({
    body: z.object({
        skuId: z.uuid('skuId: uuid inválido'),
        atributoId: z.uuid('atributoId: uuid inválido'),
        valor: z.string('valor inválido')
    })
})
export type CreateAtributeValueSchema = z.infer<typeof createAtributeValueSchema>['body'];

export const attributeSkuIdValueParamUuidSchema = z.object({
    params: z.object({
        skuId: z.uuid('skuId: uuid inválido'),
    })
})
export type AttributeSkuIdValueParamUuidSchema = z.infer<typeof attributeSkuIdValueParamUuidSchema>['params'];

export const attributeValueIdParamUuidSchema = z.object({
    params: z.object({
        id: z.uuid('skuId: uuid inválido'),
    })
})
export type AttributeValueIdParamUuidSchema = z.infer<typeof attributeValueIdParamUuidSchema>['params'];