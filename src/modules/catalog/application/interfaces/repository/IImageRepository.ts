import { Image } from "@modules/catalog/domain/entities/image.entity";

export interface SearchResult<T> {
  items: T[];
  total: number;
  current_page: number;
  limit: number;
}

export interface IImageRepository {
  save(image: Image): Promise<Image>;
  
  allPaginated(page: number, limit: number): Promise<SearchResult<Image>>;
  
  findById(id: string): Promise<Image | null>;
  
  update(image: Image): Promise<boolean>;
  
  delete(id: string): Promise<boolean>;
}
