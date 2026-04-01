import { ISkuAttributeValueRepository } from "@modules/catalog/application/interfaces/repository/ISkuAttributeValueRepository";
import { SkuAttributeValue } from "@modules/catalog/domain/entities/sku-attribute-value";

export class MockSkuAttributeValueRepository implements ISkuAttributeValueRepository {
  private items: SkuAttributeValue[] = [];

  async findById(id: string): Promise<SkuAttributeValue | null> {
    const item = this.items.find((item) => item.id === id);
    return item || null;
  }

  async findBySkuAndAttribute(skuId: string, atributoId: string): Promise<SkuAttributeValue | null> {
    const item = this.items.find(
      (item) => item.skuId === skuId && item.atributoId === atributoId
    );
    return item || null;
  }

  async findAllBySku(skuId: string): Promise<SkuAttributeValue[]> {
    return this.items.filter((item) => item.skuId === skuId);
  }

  async save(entity: SkuAttributeValue): Promise<void> {
    this.items.push(entity);
  }

  async update(entity: SkuAttributeValue): Promise<void> {
    const index = this.items.findIndex((item) => item.id === entity.id);
    if (index !== -1) {
      this.items[index] = entity;
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  clear(): void {
    this.items = [];
  }
}
