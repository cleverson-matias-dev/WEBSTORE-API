import { AppError } from "@shared/errors/AppError";
import { randomUUID } from "node:crypto";

export type StockReservationStatus = 'ACTIVE' | 'COMMITTED' | 'EXPIRED' | 'CANCELLED';

export type StockReservationProps = {
  id: string;
  orderId: string;
  sku: string;
  warehouseId: string;
  quantity: number;
  expiresAt: Date;
  status: StockReservationStatus;
};

export class StockReservation {
  private constructor(private props: StockReservationProps) {
    this.validate();
  }

  get values(): Readonly<StockReservationProps> {
    return { ...this.props };
  }

  static create(
    orderId: string,
    sku: string,
    warehouseId: string,
    quantity: number,
    minutesToExpire: number = 30
  ): StockReservation {
    if (quantity <= 0) throw new AppError("A quantidade da reserva deve ser maior que zero.", 422);
    if (minutesToExpire <= 0) throw new AppError("O tempo de expiração deve ser positivo.", 422);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + minutesToExpire);

    return new StockReservation({
      id: randomUUID(),
      orderId,
      sku,
      warehouseId,
      quantity,
      expiresAt,
      status: 'ACTIVE',
    });
  }

  static restore(props: StockReservationProps): StockReservation {
    return new StockReservation(props);
  }

  isActive(): boolean {
    return this.props.status === 'ACTIVE' && !this.isExpired();
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  markAsCommitted(): void {
    if (this.isExpired()) {
      this.props.status = 'EXPIRED';
      throw new AppError("Não é possível processar uma reserva expirada.", 422);
    }
    if (this.props.status !== 'ACTIVE') {
      throw new AppError(`Reserva não pode ser processada com status: ${this.props.status}`, 422);
    }
    this.props.status = 'COMMITTED';
  }

  cancel(): void {
    if (this.props.status === 'COMMITTED') {
      throw new AppError("Não é possível cancelar uma reserva já processada.", 422);
    }
    this.props.status = 'CANCELLED';
  }

  private validate(): void {
    if (!this.props.id || !this.props.orderId || !this.props.sku) {
      throw new AppError("ID, OrderId e SKU são obrigatórios.", 422);
    }
  }
}
