import { z } from 'zod';

export const createSkuSchema = z.object({
  body: z.object({
     product_id: z.uuid('uuid inválido'),
     sku_code: z.string('sku code inválido').min(1),
     price: z.number('preco inválido').nonnegative(),
     currency: z.string('moeda inválida').length(3).optional().default('BRL'),
     weight: z.number('peso inválido').nonnegative('peso negativo'),
     dimensions: z.string('dimensões inválidas').min(1, 'dimensões inválidas'),
  })
});
export type CreateSkuSchema = z.infer<typeof createSkuSchema>['body'];

export const paramUuidSchema = z.object({
  params: z.object({
     id: z.uuid('uuid inválido'),
  })
});

export const skuPriceUpdateSchema = z.object({
  params: z.object({
     id: z.uuid('uuid inválido'),
  }),
  body: z.object({
    new_price: z.number('preço inválido').nonnegative('preço não pode ser negativo'),
    currency: z.string('preço inválido')
  })
});
export type SkuPriceUpdateSchema = z.infer<typeof skuPriceUpdateSchema>['params'];

export const skuLogistcUpdateSchema = z.object({
  params: z.object({
     id: z.uuid('uuid inválido'),
  }),
  body: z.object({
    id: z.uuid('uuid inválido'),
    weight: z.string('peso inválido'),
    dimensions: z.string('dimensões inválidas')
  })
});
export type SkuLogistcUpdateSchema = z.infer<typeof skuLogistcUpdateSchema>['params'];

export const paramProductUuidSchema = z.object({
  params: z.object({
     product_id: z.uuid('uuid inválido'),
  })
});
export type ParamProductUuidSchema = z.infer<typeof paramProductUuidSchema>['params'];