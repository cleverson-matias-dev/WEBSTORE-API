import { StockItem } from "@modules/stock/domain/entities/stock-item";

describe('StockItem Entity', () => {
  it('deve calcular a quantidade disponível corretamente', () => {
    const item = StockItem.create('SKU-123', 'W-01', 10);
    item.reserve(3);
    expect(item.quantityAvailable).toBe(7);
  });

  it('não deve permitir reservar mais do que o disponível', () => {
    const item = StockItem.create('SKU-123', 'W-01', 5);
    expect(() => item.reserve(6)).toThrow(/Estoque insuficiente/);
  });

  it('deve efetivar (commit) uma reserva corretamente', () => {
    const item = StockItem.create('SKU-123', 'W-01', 10);
    item.reserve(5);
    item.commitStock(5);
    expect(item.values.quantityOnHand).toBe(5);
    expect(item.values.quantityReserved).toBe(0);
  });

  it('deve ajustar a quantidade física manualmente', () => {
    const item = StockItem.create('SKU-123', 'W-01', 10);
    item.adjustQuantity(-5);
    expect(item.values.quantityOnHand).toBe(5);
  });

  it('deve lançar erro se o ajuste resultar em estoque negativo', () => {
    const item = StockItem.create('SKU-123', 'W-01', 5);
    expect(() => item.adjustQuantity(-10)).toThrow(/estoque físico negativo/);
  });
});
