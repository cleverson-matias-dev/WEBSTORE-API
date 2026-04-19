import { AppError } from "@shared/errors/AppError";
import { randomUUID } from "node:crypto";

export type StockWarehouseProps = {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
};

export class StockWarehouse {
  private constructor(private props: StockWarehouseProps) {}

  get values(): Readonly<StockWarehouseProps> {
    return { ...this.props };
  }

  static create(code: string, name: string): StockWarehouse {
    if (!code || !name) throw new AppError("Código e nome são obrigatórios", 422);
    
    return new StockWarehouse({
      id: randomUUID(),
      code: code.toUpperCase(),
      name,
      isActive: true,
    });
  }

  static restore(props: StockWarehouseProps): StockWarehouse {
    return new StockWarehouse(props);
  }

  update(name: string, isActive?: boolean): void {
    if (name.length < 3) throw new AppError("Nome é muito curto", 422);
    
    this.props.name = name;
    if (isActive !== undefined) {
      this.props.isActive = isActive;
    }
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  activate(): void {
    this.props.isActive = true;
  }
}
