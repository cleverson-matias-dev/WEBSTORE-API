export interface CreateSkuAttributeValueRequestDTO {
  sku_id: string;
  attribute_id: string;
  value: string;
}

export interface UpdateSkuAttributeValueRequestDTO {
  id: string;
  new_value: string;
}

export interface SkuAttributeValueResponseDTO {
  id: string;
  sku_id: string;
  attribute_id: string;
  value: string;
  updated_at: Date;
}
