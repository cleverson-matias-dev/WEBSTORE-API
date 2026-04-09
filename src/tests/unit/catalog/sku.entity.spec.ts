import { SkuDomain, type SkuProps } from "@modules/catalog/domain/entities/sku.entity";
import { Price, SkuCode, Weight } from "@modules/catalog/domain/value-objects/sku.vo";

describe('SkuDomain (Entity)', () => {
  const makeValidProps = (): SkuProps => ({
    productId: '73948e8e-d90d-49f2-8705-023a1059496f',
    skuCode: new SkuCode('TSHIRT-BLUE-P'),
    price: new Price(99.9, 'BRL'),
    weight: new Weight(200),
    dimensions: '10x20x30'
  });

  describe('Sucesso', () => {
    it('deve criar uma nova instância de SkuDomain com ID gerado automaticamente', () => {
      const props = makeValidProps();
      const sku = new SkuDomain(props);

      expect(sku.id).toBeDefined();
      expect(sku.skuCode).toBe('TSHIRT-BLUE-P'); // Testando se o VO formatou para UpperCase
      expect(sku.created_at).toBeInstanceOf(Date);
      expect(sku.updated_at).toBeInstanceOf(Date);
    });

    it('deve permitir alterar o preço e atualizar o timestamp touch', async () => {
      const sku = new SkuDomain(makeValidProps());
      const oldUpdatedAt = sku.updated_at;

      // Pequeno delay para garantir que o timestamp mude
      await new Promise(resolve => setTimeout(resolve, 10));

      sku.changePrice(new Price(150, 'USD'));

      expect(sku.price).toBe(150);
      expect(sku.currency).toBe('USD');
      expect(sku.updated_at.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it('deve atualizar logística e atualizar o timestamp touch', () => {
      const sku = new SkuDomain(makeValidProps());
      const oldUpdatedAt = sku.updated_at;

      sku.updateLogistics(new Weight(500), '50x50x50');

      expect(sku.weight).toBe(500);
      expect(sku.dimensions).toBe('50x50x50');
      expect(sku.updated_at).not.toBe(oldUpdatedAt);
    });
  });

  describe('Value Objects (Regras de Negócio)', () => {
    it('deve lançar erro se o SKU Code tiver menos de 3 caracteres', () => {
      expect(() => new SkuCode('AB')).toThrow('SKU Code deve ter no mínimo 3 caracteres.');
    });

    it('deve lançar erro se o preço for negativo', () => {
      expect(() => new Price(-1)).toThrow('O preço não pode ser negativo.');
    });

    it('deve lançar erro se o peso for zero ou negativo', () => {
      expect(() => new Weight(0)).toThrow('O peso deve ser maior que zero.');
      expect(() => new Weight(-10)).toThrow('O peso deve ser maior que zero.');
    });
  });
});
