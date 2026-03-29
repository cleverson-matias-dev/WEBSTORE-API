import { Product } from "@modules/catalog/domain/entities/product.entity";
import { Slug } from "@modules/catalog/domain/value-objects/slug.vo";

describe('Slug Value Object', () => {
  it('deve criar um slug válido a partir de uma string', () => {
    const slug = Slug.create('Monitor Gamer 4K');
    expect(slug.getValue).toBe('monitor-gamer-4k');
  });

  it('deve remover acentos e caracteres especiais', () => {
    const slug = Slug.create('Café com Leite & Açúcar!');
    expect(slug.getValue).toBe('cafe-com-leite-acucar');
  });

  it('deve lançar erro para slug muito curto', () => {
    expect(() => Slug.create('Oi')).toThrow("Slug inválido.");
  });
});

describe('Product Entity', () => {
  const makeProduct = () => Product.create({
    id: '1',
    name: 'Teclado Mecânico',
    description: 'Teclado RGB switch blue',
    category_id: 'cat-123',
    slug: ''
  });

  it('deve criar uma instância de produto com slug automático', () => {
    const product = makeProduct();
    expect(product.props.name).toBe('Teclado Mecânico');
    expect(product.props.slug).toBe('teclado-mecanico');
  });

  describe('update()', () => {
    it('deve atualizar o nome e gerar um novo slug automaticamente', () => {
      const product = makeProduct();
      
      product.update({ name: 'Teclado Wireless Pro' });

      expect(product.props.name).toBe('Teclado Wireless Pro');
      expect(product.props.slug).toBe('teclado-wireless-pro');
    });

    it('deve atualizar a descrição sem alterar o slug ou nome', () => {
      const product = makeProduct();
      const slugOriginal = product.props.slug;

      product.update({ description: 'Nova descrição detalhada' });

      expect(product.props.description).toBe('Nova descrição detalhada');
      expect(product.props.name).toBe('Teclado Mecânico');
      expect(product.props.slug).toBe(slugOriginal);
    });

    it('deve atualizar apenas a categoria mantendo os outros dados', () => {
      const product = makeProduct();
      
      product.update({ category_id: 'nova-cat-456' });

      expect(product.props.category_id).toBe('nova-cat-456');
      expect(product.props.name).toBe('Teclado Mecânico');
    });
  });
});
