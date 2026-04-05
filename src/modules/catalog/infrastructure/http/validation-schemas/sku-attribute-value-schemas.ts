import z from 'zod';

export const createAtributeValueSchema = z.object({
    body: z.object({
        sku_id: z.uuid('skuId: uuid inválido'),
        attribute_id: z.uuid('attribute_id: uuid inválido'),
        value: z.string('valor inválido')
    })
})
export type CreateAtributeValueSchema = z.infer<typeof createAtributeValueSchema>['body'];

export const attributeSkuIdValueParamUuidSchema = z.object({
    params: z.object({
        skuId: z.uuid('skuId: uuid inválido'),
    })
})
export type AttributeSkuIdValueParamUuidSchema = z.infer<typeof attributeSkuIdValueParamUuidSchema>['params'];

export const uuidParamUuidSchema = z.object({
    params: z.object({
        id: z.uuid('skuId: uuid inválido'),
    })
})
export type UuidParamUuidSchema = z.infer<typeof uuidParamUuidSchema>['params'];

export const attributeValueIdParamUuidSchema = z.object({
    params: z.object({
        id: z.uuid('skuId: uuid inválido'),
    }),
    body: z.object({
        new_value: z.string('novo valor inválido')
    })
})
export type AttributeValueIdParamUuidSchema = z.infer<typeof attributeValueIdParamUuidSchema>;