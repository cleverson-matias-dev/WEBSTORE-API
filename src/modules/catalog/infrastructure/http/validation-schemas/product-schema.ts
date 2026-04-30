import z from 'zod';

// Sub-schema para Atributos (Novo)
const skuAttributeSchema = z.object({
  name: z.string().trim().min(1, 'O nome do atributo é obrigatório'), // Ex: "Cor"
  value: z.string().trim().min(1, 'O valor do atributo é obrigatório'), // Ex: "Azul"
});

// Sub-schema para Imagens
const productImagesSchema = z.object({
  url: z.string().url('URL da imagem inválida'),
  ordem: z.number().int().nonnegative().default(0),
});

// Sub-schema para SKUs
const skuSchema = z.object({
  sku_code: z.string().trim().min(3, 'Código SKU muito curto'),
  warehouse_id: z.string().uuid('ID do depósito inválido'),
  is_default: z.boolean().default(false),
  initial_quantity: z.number().int().nonnegative(),
  price: z.number().positive('O preço deve ser maior que zero'),
  currency: z.string().length(3).default('BRL'),
  weight_in_grams: z.number().nonnegative().optional(),
  dimensions: z.string().optional(),
  // Adicionado Atributos aqui
  attributes: z.array(skuAttributeSchema).optional().default([]), 
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string()
      .trim()
      .min(2, 'O nome deve ter no mínimo 2 caracteres')
      .max(255, 'O nome é muito longo'),
    
    description: z.string()
      .trim()
      .min(10, 'A descrição deve ser mais detalhada'),
    
    category_id: z.string().uuid('ID de categoria inválido'),

    slug: z.string().trim().toLowerCase().optional(),
    short_description: z.string().max(160, 'Máximo 160 caracteres').optional(),
    brand: z.string().optional(),
    collection_id: z.string().uuid('ID de coleção inválido').optional(),
    video_url: z.string().url('URL do vídeo inválida').optional().or(z.literal('')),
    meta_description_title: z.string().max(70, 'Título SEO muito longo').optional(),

    product_type: z.enum(['simple', 'variable', 'digital', 'service']).default('simple'),
    visibility: z.enum(['catalog', 'search', 'hidden']).default('catalog'),
    has_variants: z.boolean().default(false),

    images: z.array(productImagesSchema).optional().default([]),
    skus: z.array(skuSchema).optional().default([]),

  })
  .refine((data) => {
    if (data.product_type === 'variable' && !data.has_variants) return false;
    return true;
  }, {
    message: "Produtos do tipo 'variable' devem obrigatoriamente ter variantes ativas",
    path: ['has_variants']
  })
  .refine((data) => {
    if (data.product_type === 'variable' && data.skus.length === 0) return false;
    return true;
  }, {
    message: "Produtos variáveis precisam de pelo menos um SKU cadastrado",
    path: ['skus']
  })
});

// Inferência de tipo para uso em controllers/use-cases
export type CreateProductInput = z.infer<typeof createProductSchema>['body'];


export const filterProductSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
    })
})
export type FilterProductSchema = z.infer<typeof filterProductSchema>['query'];

export const paramsUuidSchema = z.object({
    params: z.object({
        id: z.uuid({message: 'Uuid não é valido'})
    })
})
export type ParamsUuidSchema = z.infer<typeof paramsUuidSchema>['params'];

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    short_description: z.string().max(160).optional(),
    slug: z.string().optional(),
    brand: z.string().optional(),
    category_id: z.string().uuid().optional(),
    collection_id: z.string().uuid().optional(),
    product_type: z.enum(['simple', 'variable', 'digital', 'service']).optional(),
    visibility: z.enum(['catalog', 'search', 'hidden']).optional(),
    has_variants: z.boolean().optional(),
    video_url: z.string().url().optional(),
    meta_description_title: z.string().optional(),
  }).strict()
});


