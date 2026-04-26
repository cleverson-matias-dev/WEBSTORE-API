// src/application/repositories/sku-repository.interface.ts (ou Domain)

import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";

export interface ISkuRepository {
  /**
   * Persiste um novo SKU no banco de dados.
   */
  create(sku: SkuDomain): Promise<void>;

  /**
   * Atualiza os dados de um SKU existente (Preço, Logística, etc).
   */
  update(sku: SkuDomain): Promise<void>;

  /**
   * Busca um SKU pelo seu identificador único.
   */
  findById(id: string): Promise<SkuDomain | null>;

  /**
   * Busca um SKU pelo código SKU (Útil para evitar duplicidade na criação).
   */
  findByCode(skuCode: string): Promise<SkuDomain | null>;

  /**
   * Lista todos os SKUs vinculados a um produto específico.
   */
  findByProductId(productId: string): Promise<SkuDomain[]>;

  markAsDefault(sku_id: string, product_id: string): Promise<void>;

  /**
   * Remove um SKU do sistema.
   */
  delete(id: string): Promise<void>;
}
