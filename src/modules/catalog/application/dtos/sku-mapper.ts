import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";
import { Price, SkuCode, Weight } from "@modules/catalog/domain/value-objects/sku.vo";
import { Sku } from "@modules/catalog/infrastructure/persistence/entities/Sku";
import { SkuDetailsOutputDto, type DomainWithStock } from "./sku-dtos";

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

  static toOutputWithStock(sku: DomainWithStock): SkuDetailsOutputDto {
      return {
        id: sku.id,
        product_id: sku.productId,
        sku_code: sku.skuCode,
        quantity: sku.quantity,
        price: sku.price,
        currency: sku.currency,
        weight: sku.weight,
        dimensions: sku.dimensions,
        created_at: sku.created_at,
        updated_at: sku.updated_at,
      };
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

  static toOutput(sku: SkuDomain, quantity: number = 0): SkuDetailsOutputDto {
    return {
      id: sku.id,
      product_id: sku.productId,
      sku_code: sku.skuCode,
      quantity,
      price: sku.price,
      currency: sku.currency,
      weight: sku.weight,
      dimensions: sku.dimensions,
      created_at: sku.created_at,
      updated_at: sku.updated_at,
    };
  }
}
