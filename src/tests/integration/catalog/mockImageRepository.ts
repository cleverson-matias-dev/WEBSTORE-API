import { IImageRepository } from "@modules/catalog/application/interfaces/repository/IImageRepository";
import { Image } from "@modules/catalog/domain/entities/image.entity";

export class InMemoryImageRepository implements IImageRepository {
  public items: Image[] = [];

  async save(image: Image): Promise<Image> {
    this.items.push(image);
    return image;
  }

  /*eslint-disable-next-line */
  async findBy(prop: any): Promise<Image | null> {
    const key = Object.keys(prop)[0];
    /*eslint-disable-next-line */
    return this.items.find(item => (item as any)[key] === prop[key] || (item.props_read_only as any)[key] === prop[key]) || null;
  }

  async allPaginated(page: number, limit: number) {
    return { items: this.items, total: this.items.length, current_page: page, limit };
  }

  async update(image: Image): Promise<boolean> {
    const index = this.items.findIndex(i => i.props_read_only.id === image.props_read_only.id);
    if (index === -1) return false;
    this.items[Number(index)] = image;
    return true;
  }

  async delete(id: string): Promise<boolean> {
    this.items = this.items.filter(i => i.props_read_only.id !== id);
    return true;
  }
}
