import { StockWarehouse } from "@modules/stock/domain/entities/stock-warehouse";

describe('StockWarehouse Entity', () => {
  it('deve criar um depósito com código em maiúsculas', () => {
    const warehouse = StockWarehouse.create('sp-01', 'Depósito São Paulo');
    expect(warehouse.values.code).toBe('SP-01');
    expect(warehouse.values.isActive).toBe(true);
  });

  it('deve atualizar o nome e status', () => {
    const warehouse = StockWarehouse.create('RJ-01', 'Depósito Rio');
    warehouse.update('Novo Nome', false);
    expect(warehouse.values.name).toBe('Novo Nome');
    expect(warehouse.values.isActive).toBe(false);
  });

  it('deve lançar erro se o nome for muito curto na atualização', () => {
    const warehouse = StockWarehouse.create('RJ-01', 'Depósito Rio');
    expect(() => warehouse.update('Oi')).toThrow("Nome é muito curto");
  });
});
