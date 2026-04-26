import { DeleteCategoryUC, GetAllCategoriesUC, SaveCategoryUC } from "@modules/catalog/application/use-cases/category-use-cases";
import { InMemoryCategoryRepository } from "./mockCategoryRepository";
import { MockProductRepository } from "./mockProductRepository";
import { AppError } from "@shared/errors/AppError";
import { Category } from "@modules/catalog/domain/entities/category.entity";
import { CategoryName } from "@modules/catalog/domain/value-objects/category.name.vo";
import { Product } from "@modules/catalog/domain/entities/product.entity";


describe('Category Integration Tests (Use Cases + InMemoryRepo)', () => {
  let repository: InMemoryCategoryRepository;
  const productRepoMock = new MockProductRepository(); // Mock simples para o repositório de produtos

  beforeEach(() => {
    repository = new InMemoryCategoryRepository();
    // Mock do repositório de produtos necessário para o DeleteCategoryUC
  });

  describe('SaveCategoryUC', () => {
    it('deve salvar uma nova categoria e retornar o DTO', async () => {
      const useCase = new SaveCategoryUC(repository);
      const dto = { name: 'Eletrônicos', slug: 'eletronicos' };

      const result = await useCase.execute(dto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Eletrônicos');
      const savedInRepo = await repository.findBy(result.id);
      expect(savedInRepo?.getProps().name.val()).toBe('Eletrônicos');
    });

    it('deve converter parent_id vazio em null ao salvar', async () => {
      const useCase = new SaveCategoryUC(repository);
      const result = await useCase.execute({ name: 'Sub', parent_id: "", slug: 'sub' });

      expect(result.parent_id).toBeNull();
    });
  });

  describe('GetAllCategoriesUC', () => {
    it('deve retornar categorias paginadas', async () => {
      // Setup: popula o repo
      const saveUC = new SaveCategoryUC(repository);
      await saveUC.execute({ name: 'Cat 1' });
      await saveUC.execute({ name: 'Cat 2' });

      const useCase = new GetAllCategoriesUC(repository);
      const result = await useCase.execute({ page: 1, limit: 1 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });

    it('deve filtrar categorias por nome', async () => {
      const saveUC = new SaveCategoryUC(repository);
      await saveUC.execute({ name: 'Cozinha' });
      await saveUC.execute({ name: 'Banheiro' });

      const useCase = new GetAllCategoriesUC(repository);
      const result = await useCase.execute({ name: 'coz' });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Cozinha');
    });
  });

  describe('DeleteCategoryUC', () => {
    it('deve deletar uma categoria com sucesso se não houver produtos vinculados', async () => {
      const saveUC = new SaveCategoryUC(repository);
      const saved = await saveUC.execute({ name: 'Deletar' });
      
      const useCase = new DeleteCategoryUC(repository, productRepoMock);
      const result = await useCase.execute(saved.id);

      expect(result).toBe(true);
      expect(await repository.findBy(saved.id)).toBeNull();
    });

    it('deve lançar erro 409 se houver produtos vinculados à categoria', async () => {


      const category = await repository.save(new Category({
        name: new CategoryName('Categoria A')
      }))

      await productRepoMock.save(Product.create({
        category_id: category.id,
        name: 'Produto A',
        description: 'Descrição',
        slug: '',
        has_variants: true,
        product_type: "digital",
        visibility: "catalog"
      }))

      const categoryId = category.id;

      const useCase = new DeleteCategoryUC(repository, productRepoMock);

      await expect(useCase.execute(categoryId)).rejects.toThrow(
        new AppError('existem produtos vinculados a essa categoria', 409)
      );
    });
  });
});
