export interface SkuStock {
  sku: string;
  quantity: number;
}

export interface IStockService {
  getStocksBySkus(skus: string[]): Promise<SkuStock[]>;
}
