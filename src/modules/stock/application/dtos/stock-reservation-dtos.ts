export interface ReserveStockInputDTO { orderId: string; sku: string; warehouseId: string; quantity: number; }
export interface ReserveStockOutputDTO { reservationId: string; expiresAt: Date; }