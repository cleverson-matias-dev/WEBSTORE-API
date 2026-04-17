import type { StockReservation } from "@modules/stock/domain/entities/stock-reservation";

export interface IStockReservationRepository {
  save(reservation: StockReservation): Promise<void>;
  findById(id: string): Promise<StockReservation | null>;
  findByOrderId(orderId: string): Promise<StockReservation[]>;
  findExpiredActive(): Promise<StockReservation[]>;
  findActiveBySku(sku: string): Promise<StockReservation[]>;
}
