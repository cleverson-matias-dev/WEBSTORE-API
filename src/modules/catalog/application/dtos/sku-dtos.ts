export interface CreateSkuInputDto {
  product_id: string;
  sku_code: string;
  price: number;
  currency?: string;
  weight: number;
  dimensions: string;
}

export interface CreateSkuOutputDto {
  id: string;
  sku_code: string;
  created_at: Date;
}

export interface DeleteSkuInputDto {
  id: string;
}

export interface UpdatePriceInputDto {
  id: string;
  newPrice: number;
  currency?: string;
}

export interface UpdatePriceOutputDto {
  id: string;
  oldPrice: number;
  newPrice: number;
  updatedAt: Date;
}

export interface UpdateLogisticsInputDto {
  id: string;
  weight: number;
  dimensions: string;
}

export interface UpdateLogisticsOutputDto {
  id: string;
  weight: number;
  dimensions: string;
  updatedAt: Date;
}

export interface SkuDetailsOutputDto {
  id: string;
  product_id: string;
  sku_code: string;
  price: number;
  currency: string;
  weight: number;
  dimensions: string;
  created_at: Date;
  updated_at: Date;
}
