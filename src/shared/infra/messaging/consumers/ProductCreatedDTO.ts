export interface ProductCreatedDTO {
  id: string;
  name: string;
  slug: string;
  meta_description_title?: string;
  video_url?: string;
  brand?: string;
  description: string;
  short_description: string; 
  category_id: string;
  collection_id?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    parent_id?: string | null;
    created_at: Date;
    updated_at: Date;
  };
  product_type: string;
  visibility: string;
  has_variants: boolean;
  min_price?: number;
  skus?: [{
    id: string;
    product_id: string;
    sku_code: string;
    is_default: string;
    quantity?: number;
    warehouse_id: string;
    price: number;
    currency: string;
    weight: number;
    dimensions: string;
    attributes?: [{
      attribute_id?: string;
      name: string;
      value: string;
    }]
    created_at: Date;
    updated_at: Date;
  }];
  images?: [{
    id: string;
    product_id: string;
    url: string;
    ordem: number;
    created_at: Date;
  }];
  published_at?: Date;
  created_at: Date;
}

