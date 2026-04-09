import type { IImageRepository, SearchResult } from "@modules/catalog/application/interfaces/repository/IImageRepository";
import type { IImage, Image } from "@modules/catalog/domain/entities/image.entity";


export class InMemoryImageRepository implements IImageRepository {
  private items: Image[] = [];

  async save(image: Image): Promise<Image> {
    this.items.push(image);
    return image;
  }

  async allPaginated(page: number, limit: number): Promise<SearchResult<Image>> {
    const total = this.items.length;
    const skip = (page - 1) * limit;
    
    // Simula a ordenação por 'ordem' conforme seu repositório TypeORM
    const sortedItems = [...this.items].sort((a, b) => a.props_read_only.ordem - b.props_read_only.ordem);
    const paginatedItems = sortedItems.slice(skip, skip + limit);

    return {
      items: paginatedItems,
      total,
      current_page: page,
      limit
    };
  }

  async findBy(prop: object): Promise<Image | null> {
    const [key, value] = Object.entries(prop)[0];

    const found = this.items.find((item) => {
      const props: Readonly<IImage> = item.props_read_only;
      
      // Tratamento especial para o getter 'url' que não está no objeto de props
      if (key === 'url') return item.url === value;
      
      // Busca dinâmica nas props (id, product_id, etc)
      /*eslint-disable-next-line */
      return (props as any)[key] === value;
    });

    return found || null;
  }

  async update(image: Image): Promise<boolean> {
    const index = this.items.findIndex(
      (item) => item.props_read_only.id === image.props_read_only.id
    );

    if (index === -1) return false;

    this.items[Number(index)] = image;
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.props_read_only.id === id);

    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
