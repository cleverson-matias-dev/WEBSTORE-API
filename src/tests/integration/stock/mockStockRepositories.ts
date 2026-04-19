import type { IStockItemRepository } from "@modules/stock/application/interfaces/repository/stock-item-repository-interface";
import type { IStockReservationRepository } from "@modules/stock/application/interfaces/repository/stock-reservation-repository.interface";
import type { IStockWarehouseRepository } from "@modules/stock/application/interfaces/repository/stock-warehouse-repository-interface";
import { StockItem } from "@modules/stock/domain/entities/stock-item";
import { StockReservation } from "@modules/stock/domain/entities/stock-reservation";
import { StockWarehouse } from "@modules/stock/domain/entities/stock-warehouse";

// Mock para IStockItemRepository
export class InMemoryStockItemRepository implements IStockItemRepository {
  private items: StockItem[] = [];

  async findBySkuAndWarehouse(sku: string, warehouseId: string): Promise<StockItem | null> {
    const item = this.items.find(i => i.values.sku === sku && i.values.warehouseId === warehouseId);
    return item ? StockItem.restore(item.values) : null;
  }

  async findAllBySku(sku: string): Promise<StockItem[]> {
    return this.items
      .filter(i => i.values.sku === sku)
      .map(i => StockItem.restore(i.values));
  }

  async save(stockItem: StockItem): Promise<void> {
    const index = this.items.findIndex(
      i => i.values.sku === stockItem.values.sku && i.values.warehouseId === stockItem.values.warehouseId
    );
    if (index >= 0) {
      this.items[Number(index)] = stockItem;
    } else {
      this.items.push(stockItem);
    }
  }

  async findByIds(ids: string[]): Promise<StockItem[]> {
    return this.items
      .filter(i => ids.includes(i.values.id))
      .map(i => StockItem.restore(i.values));
  }

  async exists(sku: string, warehouseId: string): Promise<boolean> {
    return this.items.some(i => i.values.sku === sku && i.values.warehouseId === warehouseId);
  }
}

// Mock para IStockReservationRepository
export class InMemoryStockReservationRepository implements IStockReservationRepository {
  private reservations: StockReservation[] = [];

  async save(reservation: StockReservation): Promise<void> {
    const index = this.reservations.findIndex(r => r.values.id === reservation.values.id);
    if (index >= 0) {
      this.reservations[Number(index)] = reservation;
    } else {
      this.reservations.push(reservation);
    }
  }

  async findById(id: string): Promise<StockReservation | null> {
    const res = this.reservations.find(r => r.values.id === id);
    return res ? StockReservation.restore(res.values) : null;
  }

  async findByOrderId(orderId: string): Promise<StockReservation[]> {
    return this.reservations
      .filter(r => r.values.orderId === orderId)
      .map(r => StockReservation.restore(r.values));
  }

  async findExpiredActive(): Promise<StockReservation[]> {
    return this.reservations
      .filter(r => r.isActive() && r.isExpired())
      .map(r => StockReservation.restore(r.values));
  }

  async findActiveBySku(sku: string): Promise<StockReservation[]> {
    return this.reservations
      .filter(r => r.values.sku === sku && r.values.status === 'ACTIVE')
      .map(r => StockReservation.restore(r.values));
  }
}

// Mock para IStockWarehouseRepository
export class InMemoryStockWarehouseRepository implements IStockWarehouseRepository {
  private warehouses: StockWarehouse[] = [];

  async save(warehouse: StockWarehouse): Promise<void> {
    const index = this.warehouses.findIndex(w => w.values.id === warehouse.values.id);
    if (index >= 0) {
      this.warehouses[Number(index)] = warehouse;
    } else {
      this.warehouses.push(warehouse);
    }
  }

  async findById(id: string): Promise<StockWarehouse | null> {
    const w = this.warehouses.find(w => w.values.id === id);
    return w ? StockWarehouse.restore(w.values) : null;
  }

  async findByCode(code: string): Promise<StockWarehouse | null> {
    const w = this.warehouses.find(w => w.values.code === code.toUpperCase());
    return w ? StockWarehouse.restore(w.values) : null;
  }

  async findAll(): Promise<StockWarehouse[]> {
    return this.warehouses.map(w => StockWarehouse.restore(w.values));
  }

  async findActive(): Promise<StockWarehouse[]> {
    return this.warehouses
      .filter(w => w.values.isActive)
      .map(w => StockWarehouse.restore(w.values));
  }

  async existsByCode(code: string): Promise<boolean> {
    return this.warehouses.some(w => w.values.code === code.toUpperCase());
  }
}
