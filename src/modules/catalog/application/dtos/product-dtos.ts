import type { CategoryDTO } from "./category-dtos";
import type { ImageResponseDTO } from "./image-dtos";
import type { SkuDetailsOutputDto } from "./sku-dtos";

export interface CreateProductInputDTO {
  name: string;
  description: string;
  category_id: string;
}

export interface ProductOutputDTO {
  id: string;
  name: string;
  slug: string;
  images?: ImageResponseDTO[];
  category?: CategoryDTO;
  skus?: SkuDetailsOutputDto[];
  description: string;
  category_id: string;
  created_at: Date;
}

export interface UpdateProductInputDTO extends Partial<CreateProductInputDTO> {
  id: string;
}
