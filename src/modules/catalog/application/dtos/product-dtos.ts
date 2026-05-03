import type { ProductType, Visibility } from "@modules/catalog/domain/entities/product.entity";
import type { CategoryDTO } from "./category-dtos";
import type { ImageResponseDTO } from "./image-dtos";
import type { SkuDetailsOutputDto } from "./sku-dtos";

export interface CreateSkuAttributeInputDTO {
  name: string;
  value: string;
}

export interface CreateSkuInputDTO {
  sku_code: string;
  warehouse_id: string;
  is_default: boolean;
  initial_quantity: number;
  price: number;
  currency: string;
  weight_in_grams?: number;
  dimensions?: string;
  attributes?: CreateSkuAttributeInputDTO[];
}

export interface CreateProductImageInputDTO {
  url: string;
  ordem: number;
}

export interface CreateProductInputDTO {
  name: string;
  description: string;
  category_id: string;
  
  // Campos opcionais
  slug?: string;
  short_description?: string;
  brand?: string;
  collection_id?: string;
  product_type?: ProductType; // 'simple' | 'variable' | etc
  visibility?: Visibility;
  has_variants?: boolean;
  video_url?: string;
  meta_description_title?: string;

  // Novos campos adicionados
  images?: CreateProductImageInputDTO[];
  skus?: CreateSkuInputDTO[];
}


export interface ProductOutputDTO {
  // Identificação e SEO
  id: string;
  name: string;
  slug: string;
  meta_description_title?: string;
  video_url?: string;
  brand?: string;

  // Conteúdo
  description: string;
  short_description: string; // Nota: No Output, garantimos que ela exista (pelo fallback da entidade)

  // Classificação e Agrupamento
  category_id: string;
  collection_id?: string;
  category?: CategoryDTO;

  // Estrutura e Comercial
  product_type: string;
  visibility: string;
  has_variants: boolean;
  min_price?: number;
  skus?: SkuDetailsOutputDto[];
  images?: ImageResponseDTO[];

  // Datas (Controle de Auditoria e Publicação)
  published_at?: Date;
  created_at: Date;
  // deleted_at NÃO é incluído por segurança (Soft delete é controle interno)
}


export interface UpdateProductInputDTO extends Partial<CreateProductInputDTO> {
  id: string;
}
