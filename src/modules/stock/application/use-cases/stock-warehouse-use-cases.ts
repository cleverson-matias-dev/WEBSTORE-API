import { AppError } from "@shared/errors/AppError";
import type { IStockWarehouseRepository } from "../interfaces/repository/stock-warehouse-repository-interface";
import { StockWarehouse } from "@modules/stock/domain/entities/stock-warehouse";
import type { CreateWarehouseInputDTO, UpdateWarehouseInputDTO, WarehouseOutputDTO } from "../dtos/stock-warehouse-dtos";

export class StockWarehouseUseCases {
  constructor(private readonly repository: IStockWarehouseRepository) {}

  async create(input: CreateWarehouseInputDTO): Promise<WarehouseOutputDTO> {
    const alreadyExists = await this.repository.findByCode(input.code);
    if (alreadyExists) {
      throw new AppError("Já existe um armazém com este código.", 422);
    }

    const warehouse = StockWarehouse.create(input.code, input.name);
    await this.repository.save(warehouse);

    return warehouse.values;
  }

  async update(id: string, input: UpdateWarehouseInputDTO): Promise<WarehouseOutputDTO> {
    const warehouse = await this.getByIdOrThrow(id);
    
    warehouse.update(input.name, input.isActive);
    await this.repository.save(warehouse);

    return warehouse.values;
  }

  async toggleStatus(id: string): Promise<WarehouseOutputDTO> {
    const warehouse = await this.getByIdOrThrow(id);
    
    if (warehouse.values.isActive) {
        warehouse.deactivate();
    } else {
        warehouse.activate();
    }

    await this.repository.save(warehouse);

    return warehouse.values;
  }


  async listAll(): Promise<WarehouseOutputDTO[]> {
    const warehouses = await this.repository.findAll();
    return warehouses.map(w => w.values);
  }

  async getDetail(id: string): Promise<WarehouseOutputDTO> {
    const warehouse = await this.getByIdOrThrow(id);
    return warehouse.values;
  }

  private async getByIdOrThrow(id: string): Promise<StockWarehouse> {
    const warehouse = await this.repository.findById(id);
    if (!warehouse) {
      throw new AppError("Armazém não encontrado.", 404);
    }
    return warehouse;
  }
}
