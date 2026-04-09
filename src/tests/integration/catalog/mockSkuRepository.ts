import type { ISkuRepository } from "@modules/catalog/application/interfaces/repository/ISkuRepository";
import type { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";

export class InMemorySkuRepository implements ISkuRepository {
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
    const sku = this.items.find((item) => item.id === id);
    return sku || null;
  }

  async findByCode(skuCode: string): Promise<SkuDomain | null> {
    // O domínio já garante UpperCase, mas fazemos o check por segurança
    const sku = this.items.find((item) => item.skuCode === skuCode.toUpperCase());
    return sku || null;
  }

  async findByProductId(productId: string): Promise<SkuDomain[]> {
    return this.items.filter((item) => item.productId === productId);
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
