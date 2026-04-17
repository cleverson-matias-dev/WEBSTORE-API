import type { IStockItemRepository } from "../interfaces/repository/stock-item-repository-interface";
import type { IStockReservationRepository } from "../interfaces/repository/stock-reservation-repository.interface";

export class ExpiredReservationCleaner {
  constructor(
    private readonly itemRepo: IStockItemRepository,
    private readonly reservationRepo: IStockReservationRepository
  ) {}

  async execute(): Promise<void> {
    const expiredReservations = await this.reservationRepo.findExpiredActive();
    console.log(`Reservas expiradas encontradas: ${expiredReservations.length}`);

    for (const res of expiredReservations) {
      const item = await this.itemRepo.findBySkuAndWarehouse(res.values.sku, res.values.warehouseId);
      console.log(`Item encontrado para limpeza: ${!!item}`); 
      if (item) {
        res.cancel(); 
        item.releaseReservation(res.values.quantity); 
        
        await this.itemRepo.save(item);
        await this.reservationRepo.save(res);console.log(`Estoque liberado! Novo disponível: ${item.quantityAvailable}`); // DEBUG 3
      }
    }
  }
}
