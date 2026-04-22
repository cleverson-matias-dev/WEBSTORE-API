import type { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";

export interface CreateSkuInputDto {
  product_id: string;
  sku_code: string;
  warehouse_id: string;
  initial_quantity: number;
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
  new_price: number;
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
  quantity?: number;
  price: number;
  currency: string;
  weight: number;
  dimensions: string;
  created_at: Date;
  updated_at: Date;
}

export interface SkuCreatedEventDTO {
  sku: string;
  warehouse_id: string;
  initial_quantity: number;
}

export type DomainWithStock = SkuDomain & {
  quantity?: number
}
