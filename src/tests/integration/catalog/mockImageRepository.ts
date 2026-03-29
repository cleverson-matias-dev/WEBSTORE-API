import { IImageRepository, SearchResult } from "@modules/catalog/application/interfaces/repository/IImageRepository";
import { IImage, Image } from "@modules/catalog/domain/entities/image.entity";

export class MockImageRepository implements IImageRepository {
  public items: Image[] = [];

  async save(image: Image): Promise<Image> {
    this.items.push(image);
    return image;
  }

  async findBy(prop: Record<string, any>): Promise<Image | null> {
    const image = this.items.find((item) => {
      const props = item.props_read_only;
      // Compara cada chave do objeto 'prop' com os valores dentro de 'props_read_only'
      return Object.entries(prop).every(([key, value]) => {
        return props[key as keyof IImage] === value;
      });
    });

    return image || null;
  }

  async allPaginated(page: number, limit: number): Promise<SearchResult<Image>> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Ordenação simulada por 'ordem' para manter paridade com o TypeORM
    const sortedItems = [...this.items].sort((a, b) => 
        a.props_read_only.ordem - b.props_read_only.ordem
    );

    const paginatedItems = sortedItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total: this.items.length,
      current_page: page,
      limit: limit
    };
  }

  async update(image: Image): Promise<boolean> {
    const id = image.props_read_only.id;
    const index = this.items.findIndex((item) => item.props_read_only.id === id);

    if (index !== -1) {
      this.items[index] = image;
      return true;
    }
    return false;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.props_read_only.id === id);

    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  // Método auxiliar útil para testes de domínio
  async findByProductId(produto_id: string): Promise<Image[]> {
    return this.items.filter(
      (item) => item.props_read_only.produto_id === produto_id
    );
  }
}
