export interface CreateSkuAttributeValueRequest {
  skuId: string;
  atributoId: string;
  valor: string;
}

export interface UpdateSkuAttributeValueRequest {
  id: string;
  novoValor: string;
}

export interface SkuAttributeValueResponse {
  id: string;
  skuId: string;
  atributoId: string;
  valor: string;
  updatedAt: Date;
}
