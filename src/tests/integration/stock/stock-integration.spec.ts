import { StoreStockUseCases } from "@modules/stock/application/use-cases/stock-store-use-cases";
import { InMemoryStockItemRepository, InMemoryStockReservationRepository } from "./mockStockRepositories";
import { CmsStockUseCases } from "@modules/stock/application/use-cases/stock-cms-use-cases";
import { StockItem } from "@modules/stock/domain/entities/stock-item";


describe("Integração: Fluxos de Estoque", () => {
  let itemRepo: InMemoryStockItemRepository;
  let reservationRepo: InMemoryStockReservationRepository;
  let storeUseCases: StoreStockUseCases;
  let cmsUseCases: CmsStockUseCases;

  const SKU = "PROD-123";
  const WAREHOUSE_ID = "WH-001";

  beforeEach(() => {
    itemRepo = new InMemoryStockItemRepository();
    reservationRepo = new InMemoryStockReservationRepository();
    storeUseCases = new StoreStockUseCases(itemRepo, reservationRepo);
    cmsUseCases = new CmsStockUseCases(itemRepo);
  });

  describe("StoreStockUseCases - Reserva de Estoque", () => {
    it("deve realizar uma reserva com sucesso e atualizar o saldo disponível", async () => {
      // 1. Setup: Criar item com 10 unidades física
      const item = StockItem.create(SKU, WAREHOUSE_ID, 10);
      await itemRepo.save(item);

      // 2. Executar reserva de 4 unidades
      const result = await storeUseCases.reserve({
        orderId: "ORDER-1",
        sku: SKU,
        warehouseId: WAREHOUSE_ID,
        quantity: 4
      });

      // 3. Verificações
      expect(result.reservationId).toBeDefined();
      
      const updatedItem = await itemRepo.findBySkuAndWarehouse(SKU, WAREHOUSE_ID);
      expect(updatedItem?.quantityAvailable).toBe(6);
      expect(updatedItem?.values.quantityReserved).toBe(4);
    });

    it("deve lançar erro ao tentar reservar mais do que o disponível", async () => {
      const item = StockItem.create(SKU, WAREHOUSE_ID, 2);
      await itemRepo.save(item);

      await expect(storeUseCases.reserve({
        orderId: "ORDER-2",
        sku: SKU,
        warehouseId: WAREHOUSE_ID,
        quantity: 5
      })).rejects.toThrow("Estoque insuficiente");
    });
  });

  describe("CmsStockUseCases - Ajustes Manuais", () => {
    it("deve ajustar a quantidade física de um item existente", async () => {
      const item = StockItem.create(SKU, WAREHOUSE_ID, 5);
      await itemRepo.save(item);

      await cmsUseCases.adjustQuantity({
        sku: SKU,
        warehouseId: WAREHOUSE_ID,
        amount: 10, // +10 unidades
        reason: "Reposição de estoque"
      });

      const updatedItem = await itemRepo.findBySkuAndWarehouse(SKU, WAREHOUSE_ID);
      expect(updatedItem?.values.quantityOnHand).toBe(15);
    });
  });

});
