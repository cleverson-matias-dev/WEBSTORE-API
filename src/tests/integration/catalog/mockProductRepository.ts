/*eslint-disable */
import { IProductRepository } from "@modules/catalog/application/interfaces/repository/IProductRepository";
import { Product, ProductProps } from "@modules/catalog/domain/entities/product.entity";

export class MockProductRepository implements IProductRepository {
  public items: Product[] = [];

  async save(product: Product): Promise<Product> {
    this.items.push(product);
    return product;
  }

  async findBy(prop: Partial<ProductProps>): Promise<Product | null> {
  const entries = Object.entries(prop);
  
  if (entries.length === 0) return null;

  const found = this.items.find((item) => {
    const currentProps = item?.props;

    // Se o produto ou as props não existirem, este item não coincide com a busca
    if (!currentProps) return false;

    return entries.every(([key, value]) => {
      // Verifica se a chave existe no objeto e se o valor coincide
      return (
        key in currentProps && 
        currentProps[key as keyof ProductProps] === value
      );
    });
  });

  return found || null;
}


  async allPaginated(
    page: number = 1,
    limit: number = 10,
    filter?: any
  ): Promise<any> {
    let filteredItems = [...this.items];

    if (filter?.name) {
      filteredItems = filteredItems.filter(item => 
        item.props.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total: filteredItems.length,
      current_page: page,
      limit: limit,
      last_page: Math.ceil(filteredItems.length / limit)
    };
  }

  async update(product: Product): Promise<boolean> {
    const index = this.items.findIndex(
      (item) => item.props.id === product.props.id
    );

    if (index !== -1) {
      this.items[index] = product;
      return true;
    }
    return false;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.props.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  // Atalho para facilitar o CreateImageUseCase
  async findById(id: string): Promise<Product | null> {
    return this.findBy({ id });
  }
}
