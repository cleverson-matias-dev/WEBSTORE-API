import { SkuDomain, SkuProps } from "@modules/catalog/domain/entities/sku.entity";
import { Price, SkuCode, Weight } from "@modules/catalog/domain/value-objects/sku.vo";

describe('Sku Domain Entity', () => {
  let validProps: SkuProps;

  beforeEach(() => {
    validProps = {
      productId: 'prod-123',
      skuCode: new SkuCode('ABC123'),
      price: new Price(100),
      weight: new Weight(500),
      dimensions: '10x10x10',
    };
  });

  describe('Value Objects', () => {
    test('SkuCode deve formatar para maiúsculo e validar tamanho', () => {
      const code = new SkuCode('abc');
      expect(code.val).toBe('ABC');
      expect(() => new SkuCode('ab')).toThrow("SKU Code deve ter no mínimo 3 caracteres.");
    });

    test('Price não deve aceitar valores negativos', () => {
      expect(() => new Price(-1)).toThrow("O preço não pode ser negativo.");
      expect(new Price(0).val).toBe(0);
    });

    test('Weight deve ser maior que zero', () => {
      expect(() => new Weight(0)).toThrow("O peso deve ser maior que zero.");
      expect(new Weight(1).val).toBe(1);
    });
  });

  describe('Sku Entity', () => {
    test('deve criar uma instância de Sku com ID gerado automaticamente', () => {
      const sku = new SkuDomain(validProps);
      expect(sku.id).toBeDefined();
      expect(sku.skuCode).toBe('ABC123');
      expect(sku.created_at).toBeInstanceOf(Date);
    });

    test('deve alterar o preço e atualizar o timestamp updated_at', async () => {
      const sku = new SkuDomain(validProps);
      const initialUpdate = sku.updated_at;

      // Pequeno delay para garantir a mudança do timestamp
      await new Promise(res => setTimeout(res, 10));

      sku.changePrice(new Price(150));
      
      expect(sku.price).toBe(150);
      expect(sku.updated_at.getTime()).toBeGreaterThan(initialUpdate.getTime());
    });

    test('deve atualizar logística (peso e dimensões)', () => {
      const sku = new SkuDomain(validProps);
      const newWeight = new Weight(1000);
      const newDim = '20x20x20';

      sku.updateLogistics(newWeight, newDim);

      expect(sku.weight).toBe(1000);
      expect(sku.dimensions).toBe(newDim);
    });
  });
});
