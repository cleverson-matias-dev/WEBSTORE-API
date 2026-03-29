export interface CreateProductInputDto {
  name: string;
  description: string;
  category_id: string;
}

export interface ProductOutputDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  created_at: Date;
}

export interface UpdateProductInputDto extends Partial<CreateProductInputDto> {
  id: string;
}
