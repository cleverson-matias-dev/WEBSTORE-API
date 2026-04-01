import { SkuAttributeValue } from "@modules/catalog/domain/entities/sku-attribute-value";

export interface ISkuAttributeValueRepository {
  findById(id: string): Promise<SkuAttributeValue | null>;
  findBySkuAndAttribute(skuId: string, atributoId: string): Promise<SkuAttributeValue | null>;
  findAllBySku(skuId: string): Promise<SkuAttributeValue[]>;
  save(entity: SkuAttributeValue): Promise<void>;
  update(entity: SkuAttributeValue): Promise<void>;
  delete(id: string): Promise<void>;
}
