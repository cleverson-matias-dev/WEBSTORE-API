import type { Repository } from "typeorm";
import { StockReservationSchema } from "./entities/StockReservationSchema";
import type { IStockReservationRepository } from "@modules/stock/application/interfaces/repository/stock-reservation-repository.interface";
import { StockReservation, type StockReservationStatus } from "@modules/stock/domain/entities/stock-reservation";
import { AppDataSource } from "@shared/infra/db/data-source";

export class TypeOrmStockReservationRepository implements IStockReservationRepository {
  private readonly repository: Repository<StockReservationSchema> = AppDataSource.getRepository(StockReservationSchema);

  private mapToDomain(model: StockReservationSchema): StockReservation {
    return StockReservation.restore({
      id: model.id,
      orderId: model.orderId,
      sku: model.sku,
      warehouseId: model.warehouseId,
      quantity: model.quantity,
      expiresAt: model.expiresAt,
      status: model.status as StockReservationStatus,
    });
  }

  async save(reservation: StockReservation): Promise<void> {
    await this.repository.save(reservation.values);
  }

  async findById(id: string): Promise<StockReservation | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? this.mapToDomain(model) : null;
  }

  async findByOrderId(orderId: string): Promise<StockReservation[]> {
    const models = await this.repository.find({ where: { orderId } });
    return models.map(model => this.mapToDomain(model));
  }

  async findExpiredActive(): Promise<StockReservation[]> {
    const now = new Date();
    const models = await this.repository
      .createQueryBuilder("res")
      .where("res.status = :status", { status: 'ACTIVE' })
      .andWhere("res.expiresAt < :now", { now })
      .getMany();
    
    return models.map(model => this.mapToDomain(model));
  }

  async findActiveBySku(sku: string): Promise<StockReservation[]> {
    const models = await this.repository.find({ where: { sku, status: 'ACTIVE' } });
    return models.map(model => this.mapToDomain(model));
  }
}
