import { AppError } from "@shared/errors/AppError";
import { randomUUID } from "node:crypto";

export type StockItemProps = {
  id: string;
  sku: string;
  warehouseId: string;
  quantityOnHand: number;
  quantityReserved: number;
  version: number;
};

export class StockItem {
  private constructor(private props: StockItemProps) {
    this.validate();
  }

  get values(): Readonly<StockItemProps> {
    return { ...this.props };
  }

  private incrementVersion(): void {
    this.props.version++;
  }

  get quantityAvailable(): number {
    return this.props.quantityOnHand - this.props.quantityReserved;
  }

  static create(sku: string, warehouseId: string, initialQuantity: number = 0): StockItem {
    if (initialQuantity < 0) throw new AppError("Quantidade inicial não pode ser negativa.", 422);
    return new StockItem({
      id: randomUUID(),
      sku,
      warehouseId,
      quantityOnHand: initialQuantity,
      quantityReserved: 0,
      version: 1
    });
  }

  static restore(props: StockItemProps): StockItem {
    return new StockItem(props);
  }

  reserve(amount: number): void {
    if (amount <= 0) throw new AppError("A quantidade de reserva deve ser positiva.", 422);
    if (amount > this.quantityAvailable) {
      throw new AppError(`Estoque insuficiente. Disponível: ${this.quantityAvailable}`, 422);
    }
    this.props.quantityReserved += amount;
    this.incrementVersion();
  }

  commitStock(amount: number): void {
    if (amount <= 0) throw new AppError("A quantidade de baixa deve ser positiva.", 422);
    if (amount > this.props.quantityReserved) {
      throw new AppError("Baixa de estoque exige reserva prévia equivalente.", 422);
    }
    this.props.quantityReserved -= amount;
    this.props.quantityOnHand -= amount;
    this.incrementVersion();
  }

  releaseReservation(amount: number): void {
    if (amount <= 0) throw new AppError("A quantidade de liberação deve ser positiva.", 422);
    this.props.quantityReserved = Math.max(0, this.props.quantityReserved - amount);
    this.incrementVersion();
  }

  adjustQuantity(amount: number): void {
    const newQuantity = this.props.quantityOnHand + amount;
    if (newQuantity < 0) throw new AppError("Ajuste resultaria em estoque físico negativo.", 422);
    this.props.quantityOnHand = newQuantity;
    this.incrementVersion();
  }

  private validate(): void {
    if (this.props.quantityOnHand < 0) throw new AppError("Quantidade física não pode ser negativa.", 422);
    if (this.props.quantityReserved < 0) throw new AppError("Quantidade reservada não pode ser negativa.", 422);
    if (this.props.quantityReserved > this.props.quantityOnHand) {
      throw new AppError("Reserva não pode ser maior que o estoque físico.", 422);
    }
  }
}
