import { IImageRepository, SearchResult } from "@modules/catalog/application/interfaces/repository/IImageRepository";
import { Image } from "@modules/catalog/domain/entities/image.entity";

export class MockImageRepository implements IImageRepository {
  private items: Map<string, Image> = new Map();

  async save(image: Image): Promise<Image> {
    const id = image.props_read_only.id || Math.random().toString(36).substr(2, 9);
    // Simula a atribuição de ID que o DB faria
    const savedImage = new Image({ ...image.props_read_only, id });
    this.items.set(id, savedImage);
    return savedImage;
  }

  async allPaginated(page: number, limit: number): Promise<SearchResult<Image>> {
    const allItems = Array.from(this.items.values());
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      items: allItems.slice(start, end),
      total: allItems.length,
      current_page: page,
      limit: limit
    };
  }

  async findById(id: string): Promise<Image | null> {
    return this.items.get(id) || null;
  }

  async update(image: Image): Promise<boolean> {
    const id = image.props_read_only.id;
    if (!id || !this.items.has(id)) return false;
    this.items.set(id, image);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}
