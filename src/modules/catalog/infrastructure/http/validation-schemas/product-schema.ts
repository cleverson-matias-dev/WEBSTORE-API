import z from 'zod';

// 1. Definição dos Enums para consistência com o domínio
const ProductTypeEnum = z.enum(['simple', 'variable', 'digital', 'service']);
const VisibilityEnum = z.enum(['catalog', 'search', 'hidden']);

export const createProductSchema = z.object({
  body: z.object({
    name: z.string()
      .trim()
      .min(2, 'O nome deve ter no mínimo 2 caracteres')
      .max(255, 'O nome é muito longo'),
    
    description: z.string()
      .trim()
      .min(10, 'A descrição deve ser mais detalhada (mínimo 10 caracteres)'),
    
    category_id: z.string().uuid('ID de categoria inválido'),

    // Campos Opcionais com valores default ou tratamento nulo
    slug: z.string().trim().toLowerCase().optional(),
    short_description: z.string().max(160, 'Máximo 160 caracteres').optional(),
    brand: z.string().optional(),
    collection_id: z.string().uuid('ID de coleção inválido').optional(),
    video_url: z.string().url('URL do vídeo inválida').optional(),
    meta_description_title: z.string().max(70, 'Título SEO muito longo').optional(),

    // Enums e Booleanos
    product_type: ProductTypeEnum.default('simple'),
    visibility: VisibilityEnum.default('catalog'),
    has_variants: z.boolean().default(false),

  })
  // 2. Validação Cruzada (Refined)
  .refine((data) => {
    if (data.product_type === 'variable' && data.has_variants === false) {
      return false;
    }
    return true;
  }, {
    message: "Produtos do tipo 'variable' devem obrigatoriamente ter variantes ativas",
    path: ['has_variants']
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


