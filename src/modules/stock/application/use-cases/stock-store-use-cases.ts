import { StockReservation } from "@modules/stock/domain/entities/stock-reservation";
import { AppError } from "@shared/errors/AppError";
import type { ReserveStockInputDTO, ReserveStockOutputDTO } from "../dtos/stock-reservation-dtos";
import type { CheckAvailabilityInputDTO, CheckAvailabilityOutputDTO } from "../dtos/stock-item-dtos";
import type { IStockReservationRepository } from "../interfaces/repository/stock-reservation-repository.interface";
import type { IStockItemRepository } from "../interfaces/repository/stock-item-repository-interface";

export class StoreStockUseCases {
  constructor(
    private readonly itemRepo: IStockItemRepository,
    private readonly reservationRepo: IStockReservationRepository
  ) {}

  async checkAvailability(input: CheckAvailabilityInputDTO): Promise<CheckAvailabilityOutputDTO> {
    const item = await this.itemRepo.findBySkuAndWarehouse(input.sku, input.warehouseId);
    const available = item ? item.quantityAvailable : 0;
    return { 
      sku: input.sku, 
      available, 
      isOutOfStock: available <= 0 
    };
  }

  async reserve(input: ReserveStockInputDTO): Promise<ReserveStockOutputDTO> {
    const MAX_RETRIES = 3;
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
      try {
        return await this.executeReservation(input);
      } catch (error) {
        attempts++;
        
        // Se for erro de concorrência (409) e ainda houver tentativas, ele refaz o loop
        const isConcurrencyError = error instanceof AppError && error.statusCode === 409;
        
        if (!isConcurrencyError || attempts >= MAX_RETRIES) {
          throw error;
        }
        
        // Opcional: Adicionar um pequeno delay (jitter) entre tentativas
        await new Promise(res => setTimeout(res, 50 * attempts));
      }
    }

    throw new AppError("Não foi possível processar a reserva devido a alta demanda. Tente novamente.", 429);
  }

  // Lógica interna isolada para facilitar o retry
  private async executeReservation(input: ReserveStockInputDTO): Promise<ReserveStockOutputDTO> {
    const item = await this.itemRepo.findBySkuAndWarehouse(input.sku, input.warehouseId);
    
    if (!item) {
      throw new AppError("Produto não encontrado no estoque.", 404);
    }

    // A lógica de negócio usa a versão carregada no 'item'
    item.reserve(input.quantity);
    
    const reservation = StockReservation.create(
      input.orderId, 
      input.sku, 
      input.warehouseId, 
      input.quantity
    );

    // O repositório deve lançar AppError(..., 409) se a versão no banco for diferente da do 'item'
    await this.itemRepo.save(item);
    await this.reservationRepo.save(reservation);

    return { 
      reservationId: reservation.values.id, 
      expiresAt: reservation.values.expiresAt 
    };
  }
}
