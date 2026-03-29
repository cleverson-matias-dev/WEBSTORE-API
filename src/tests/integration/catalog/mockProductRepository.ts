import { IProductRepository, PagedProductOutput } from "@modules/catalog/application/interfaces/repository/IProductRepository";
import { Product } from "@modules/catalog/domain/entities/product.entity";

export class MockProductRepository implements IProductRepository {
  public items: Product[] = [];

  async save(product: Product): Promise<Product> {
    this.items.push(product);
    return product;
  }

  async findBy(prop: any): Promise<Product | null> {
    const key = Object.keys(prop)[0];
    const value = prop[key];
    
    return this.items.find(item => (item.props as any)[key] === value) || null;
  }

  async update(product: Product): Promise<boolean> {
    const index = this.items.findIndex(item => item.props.id === product.props.id);
    if (index === -1) return false;
    this.items[index] = product;
    return true;
  }

  // Implementações simplificadas para o exemplo
  async allPaginated(): Promise<PagedProductOutput> { return {} as any; }
  async delete(): Promise<boolean> { return true; }
}
