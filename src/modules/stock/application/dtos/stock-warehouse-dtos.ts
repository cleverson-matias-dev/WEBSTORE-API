export interface CreateWarehouseInputDTO {
  code: string;
  name: string;
}

export interface UpdateWarehouseInputDTO {
  name: string;
  isActive?: boolean;
}

export interface WarehouseOutputDTO {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}