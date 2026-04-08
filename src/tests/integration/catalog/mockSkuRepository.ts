import { ISkuRepository } from "@modules/catalog/application/interfaces/repository/ISkuRepository";
import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";

// sku-in-memory.repository.ts
export class MockSkuRepository implements ISkuRepository {
  private items: SkuDomain[] = [];

  async create(sku: SkuDomain): Promise<void> {
    this.items.push(sku);
  }

  async update(sku: SkuDomain): Promise<void> {
    const index = this.items.findIndex((item) => item.id === sku.id);
    if (index !== -1) {
      this.items[Number(index)] = sku;
    }
  }

  async findById(id: string): Promise<SkuDomain | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async findByCode(skuCode: string): Promise<SkuDomain | null> {
    return this.items.find((item) => item.skuCode === skuCode.toUpperCase()) || null;
  }

  async findByProductId(productId: string): Promise<SkuDomain[]> {
    return this.items.filter((item) => item.productId === productId);
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
