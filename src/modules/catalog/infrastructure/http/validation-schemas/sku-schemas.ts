import { z } from 'zod';

export const createSkuSchema = z.object({
  body: z.object({
     productId: z.uuid('uuid inválido'),
     skuCode: z.string('sku code inválido').min(1),
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
export type ParamUuidSchema = z.infer<typeof paramUuidSchema>['params'];

export const paramProductUuidSchema = z.object({
  params: z.object({
     productId: z.uuid('uuid inválido'),
  })
});
export type ParamProductUuidSchema = z.infer<typeof paramProductUuidSchema>['params'];