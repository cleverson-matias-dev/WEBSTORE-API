import { StockReservation } from "@modules/stock/domain/entities/stock-reservation";

describe('StockReservation Entity', () => {
  it('deve criar uma reserva ativa com data de expiração futura', () => {
    const res = StockReservation.create('ORDER-1', 'SKU-1', 'W-1', 10, 30);
    expect(res.isActive()).toBe(true);
    expect(res.values.status).toBe('ACTIVE');
    expect(res.values.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('deve marcar como expirada se o tempo passar', () => {
    const pastDate = new Date();
    pastDate.setMinutes(pastDate.getMinutes() - 1);
    
    const res = StockReservation.restore({
      id: '1', orderId: 'O1', sku: 'S1', warehouseId: 'W1',
      quantity: 10, status: 'ACTIVE', expiresAt: pastDate
    });

    expect(res.isExpired()).toBe(true);
    expect(res.isActive()).toBe(false);
  });

  it('não deve permitir cancelar uma reserva já efetivada (COMMITTED)', () => {
    const res = StockReservation.create('ORDER-1', 'SKU-1', 'W-1', 10);
    res.markAsCommitted();
    expect(() => res.cancel()).toThrow(/Não é possível cancelar/);
  });

  it('deve lançar erro ao efetivar reserva expirada', () => {
    const pastDate = new Date();
    pastDate.setMinutes(pastDate.getMinutes() - 1);
    
    const res = StockReservation.restore({
      id: '1', orderId: 'O1', sku: 'S1', warehouseId: 'W1',
      quantity: 10, status: 'ACTIVE', expiresAt: pastDate
    });

    expect(() => res.markAsCommitted()).toThrow(/reserva expirada/);
    expect(res.values.status).toBe('EXPIRED');
  });
});
