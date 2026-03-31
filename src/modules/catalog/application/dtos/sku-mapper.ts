import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";
import { Price, SkuCode, Weight } from "@modules/catalog/domain/value-objects/sku.vo";
import { Sku } from "@modules/catalog/infrastructure/persistence/entities/Sku";
import { SkuDetailsOutputDto } from "./sku-dtos";

export class SkuMapper {
  static toDomain(raw: Sku): SkuDomain {
    const skuCode = new SkuCode(raw.codigo_sku);
    const price = new Price(Number(raw.preco), raw.currency || 'BRL');
    const weight = new Weight(Number(raw.peso));

    return new SkuDomain(
      {
        productId: raw.product_id,
        skuCode: skuCode,
        price: price,
        weight: weight,
        dimensions: raw.dimensoes,
      },
      raw.id
    );
  }

  static toPersistence(domain: SkuDomain): Partial<Sku> {
    return {
      id: domain.id,
      product_id: domain.productId,
      codigo_sku: domain.skuCode,
      preco: domain.price,
      currency: domain.currency,
      peso: domain.weight,
      dimensoes: domain.dimensions
    };
  }

  static toOutput(sku: SkuDomain): SkuDetailsOutputDto {
    return {
      id: sku.id,
      productId: sku.productId,
      skuCode: sku.skuCode,
      price: sku.price,
      currency: sku.currency,
      weight: sku.weight,
      dimensions: sku.dimensions,
      createdAt: sku.created_at,
      updatedAt: sku.updated_at,
    };
  }
}
