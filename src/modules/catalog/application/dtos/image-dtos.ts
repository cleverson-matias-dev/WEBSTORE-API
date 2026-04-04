// Create / Save
export interface CreateImageDTO {
  product_id: string;
  url: string;
  ordem: number;
}

// Update (Campos opcionais, exceto ID)
export interface UpdateImageDTO {
  id: string;
  url?: string;
  ordem?: number;
}

// Response (Para findById e visualização simples)
export interface ImageResponseDTO {
  id: string;
  product_id: string;
  url: string;
  ordem: number;
  created_at: Date;
}

// All Paginated
export interface PaginatedImagesDTO {
  items: ImageResponseDTO[];
  total: number;
  page: number;
}
