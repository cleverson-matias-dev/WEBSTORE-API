import { CategoryMapper } from "@modules/catalog/application/dtos/category-mapper";
import { ImageMapper } from "@modules/catalog/application/dtos/image-mappers";
import type { ProductOutputDTO } from "@modules/catalog/application/dtos/product-dtos";
import type { IProductRepository, PagedProductOutput, ProductFilter } from "@modules/catalog/application/interfaces/repository/IProductRepository";
import { Product } from "@modules/catalog/domain/entities/product.entity";


export class MockProductRepository implements IProductRepository {
  private items: Product[] = [];

  async save(product: Product): Promise<Product> {
    this.items.push(product);
    return product;
  }

  async findBy(prop: Partial<Product["props"]>): Promise<Product | null> {
    const keys = Object.keys(prop) as Array<keyof Product["props"]>;
    const found = this.items.find((item) => 
      /*eslint-disable-next-line */
      keys.every((key) => item.props[key] === prop[key])
    );
    return found || null;
  }

  async allPaginated(
    page: number = 1,
    limit: number = 10,
    filter?: ProductFilter
  ): Promise<PagedProductOutput> {
    let filteredItems = this.items;

    if (filter) {
      filteredItems = this.items.filter((item) => {
        const matchName = filter.name 
          ? item.props.name.toLowerCase().includes(filter.name.toLowerCase()) 
          : true;
        const matchSlug = filter.slug 
          ? item.props.slug === filter.slug 
          : true;
        const matchDesc = filter.description 
          ? item.props.description.toLowerCase().includes(filter.description.toLowerCase()) 
          : true;
        return matchName && matchSlug && matchDesc;
      });
    }

    const total = filteredItems.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = filteredItems.slice(start, end);

    // Mapeamento para o ProductOutputDTO refatorado
    const itemsDTO: ProductOutputDTO[] = paginatedItems.map((p) => ({
      id: p.id,
      name: p.props.name,
      slug: p.slug,
      description: p.props.description,
      category_id: p.props.category_id,
      created_at: p.props.created_at || new Date(),
      // Mapeia imagens se existirem
      images: p.props.images ? p.props.images?.map(img => ImageMapper.toDTO(img)) : undefined,
      // Mapeia categoria se existir
      category: p.props.category ? CategoryMapper.toDTO(p.props.category) : undefined,
      has_variants: p.has_variants,
      product_type: p.product_type,
      short_description: p.short_description,
      visibility: p.props.visibility,
      brand: p.props.brand,
      collection_id: p.props.collection_id,
      meta_description_title: p.props.meta_description_title,
      published_at: p.props.published_at,
      video_url: p.props.video_url
    }));

    return {
      items: itemsDTO,
      total,
      page,
      limit,
    };
  }

  async update(product: Product): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === product.id);
    if (index === -1) return false;
    this.items[Number(index)] = product;
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}
