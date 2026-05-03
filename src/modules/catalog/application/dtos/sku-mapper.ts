import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";
import { Sku } from "@modules/catalog/infrastructure/persistence/entities/Sku";
import { SkuDetailsOutputDto, type DomainWithStock } from "./sku-dtos";

export class SkuMapper {
  static toDomain(raw: Sku): SkuDomain {

    return SkuDomain.create({
      currency: raw.currency,
      is_default: raw.is_default,
      price: raw.preco,
      product_id: raw.product_id,
      sku_code: raw.codigo_sku,
      dimensions: raw.dimensoes,
      weight: raw.peso
    })
  }

  static toOutputWithStock(sku: DomainWithStock): SkuDetailsOutputDto {
      return {
        id: sku.id,
        product_id: sku.product_id,
        sku_code: sku.sku_code,
        is_default: String(sku.is_default),
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
      product_id: domain.product_id,
      codigo_sku: domain.sku_code,
      is_default: Boolean(domain.is_default),
      preco: domain.price,
      currency: domain.currency,
      peso: domain.weight,
      dimensoes: domain.dimensions
    };
  }

  static toOutput(sku: SkuDomain, quantity: number = 0): SkuDetailsOutputDto {
    return {
      id: sku.id,
      product_id: sku.product_id,
      sku_code: sku.sku_code,
      is_default: String(sku.is_default),
      quantity,
      warehouse_id: sku.warehouse_id,
      price: sku.price,
      currency: sku.currency,
      weight: sku.weight,
      dimensions: sku.dimensions,
      attributes: sku.sku_attributes.map(attr => ({attribute_id: attr.attribute_id, name: attr.name, value: attr.value})),
      created_at: sku.created_at,
      updated_at: sku.updated_at,
    };
  }
}
