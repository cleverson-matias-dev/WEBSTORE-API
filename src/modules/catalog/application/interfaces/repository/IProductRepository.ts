import { Product } from "@modules/catalog/domain/entities/product.entity";
import { ProductOutputDTO } from "../../dtos/product-dtos";

export interface ProductFilter {
  name?: string;
  slug?: string;
  description?: string;
}

export interface PagedProductOutput {
  items: ProductOutputDTO[];
  total: number;
  page: number;
  limit: number;
}

export interface IProductRepository {
  save(product: Product): Promise<Product>;
  findBy(prop: object): Promise<Product | null>;
  allPaginated(
    page?: number, 
    limit?: number, 
    filter?: ProductFilter
  ): Promise<PagedProductOutput>;
  update(product: Product): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
