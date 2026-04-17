export interface CheckAvailabilityInputDTO { sku: string; warehouseId: string; }
export interface CheckAvailabilityOutputDTO { sku: string; available: number; isOutOfStock: boolean; }
export interface AdjustStockInputDTO { sku: string; warehouseId: string; amount: number; reason: string; }
export interface StockDetailOutputDTO {
  sku: string;
  warehouseId: string;
  onHand: number; 
  reserved: number;
  available: number;
}
export interface StockItemCreateDTO {
  sku: string;
  warehouse_id: string;
  initial_quantity?: number
}