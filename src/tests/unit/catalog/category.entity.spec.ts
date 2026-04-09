import { Category } from '@modules/catalog/domain/entities/category.entity';
import { CategoryName } from '@modules/catalog/domain/value-objects/category.name.vo';
import { v4 as uuidv4, validate as isUuid } from 'uuid';

describe('Category Domain Entity', () => {
  
  describe('CategoryName (Value Object)', () => {
    it('deve criar um nome de categoria válido', () => {
      const name = 'Eletrônicos';
      const categoryName = new CategoryName(name);
      expect(categoryName.val()).toBe(name);
    });

    it('deve lançar erro se o nome for muito curto (menos de 3 caracteres)', () => {
      expect(() => new CategoryName('Oi')).toThrow('Nome de Category inválida.');
    });

    it('deve lançar erro se o nome for muito longo (mais de 100 caracteres)', () => {
      const longName = 'a'.repeat(101);
      expect(() => new CategoryName(longName)).toThrow('Nome de Category inválida.');
    });

    it('deve validar caracteres especiais permitidos', () => {
      const validName = 'Cozinha & Banheiro! @2024';
      const categoryName = new CategoryName(validName);
      expect(categoryName.val()).toBe(validName);
    });
  });

  describe('Category Entity', () => {
    it('deve instanciar uma categoria com ID e Slug automáticos', () => {
      const name = new CategoryName('Games de Ação');
      const category = new Category({ name });

      expect(isUuid(category.id)).toBe(true);
      expect(category.getProps().name.val()).toBe('Games de Ação');
      // O slug deve ser gerado pelo Slug.create (assumindo que ele transforme em kebab-case)
      expect(category.getProps().slug).toBeDefined();
    });

    it('deve aceitar um ID e Slug pré-definidos', () => {
      const customId = uuidv4();
      const customSlug = 'slug-customizado';
      const name = new CategoryName('Hardware');
      
      const category = new Category({ 
        id: customId, 
        name, 
        slug: customSlug 
      });

      expect(category.id).toBe(customId);
      expect(category.getProps().slug).toBe(customSlug);
    });

    it('deve permitir categoria com parent_id (subcategoria)', () => {
      const parentId = uuidv4();
      const name = new CategoryName('Mouse Gamer');
      const category = new Category({ 
        name, 
        parent_id: parentId 
      });

      expect(category.getProps().parent_id).toBe(parentId);
    });

    it('deve retornar as props corretamente através do getProps()', () => {
      const name = new CategoryName('Livros');
      const category = new Category({ name });
      const props = category.getProps();

      expect(props).toHaveProperty('name');
      expect(props).toHaveProperty('id');
      expect(props).toHaveProperty('slug');
    });
  });
});
