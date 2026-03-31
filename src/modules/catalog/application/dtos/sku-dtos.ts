export interface CreateSkuInputDto {
  productId: string;
  skuCode: string;
  price: number;
  currency?: string;
  weight: number;
  dimensions: string;
}

export interface CreateSkuOutputDto {
  id: string;
  skuCode: string;
  createdAt: Date;
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
  productId: string;
  skuCode: string;
  price: number;
  currency: string;
  weight: number;
  dimensions: string;
  createdAt: Date;
  updatedAt: Date;
}
