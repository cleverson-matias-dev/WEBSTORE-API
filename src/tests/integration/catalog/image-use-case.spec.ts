import { CreateImageUseCase, GetImageByIdUseCase } from "@modules/catalog/application/use-cases/image-use-cases";
import { InMemoryImageRepository } from "./mockImageRepository";
import { MockProductRepository } from "./mockProductRepository";
import { AppError } from "@shared/errors/AppError";
import { InMemoryCategoryRepository } from "./mockCategoryRepository";
import { Category } from "@modules/catalog/domain/entities/category.entity";
import { CategoryName } from "@modules/catalog/domain/value-objects/category.name.vo";
import { Product } from "@modules/catalog/domain/entities/product.entity";

const criarProduto = async (categoryRepo: InMemoryCategoryRepository, productRepo: MockProductRepository) => {
    const category =  await categoryRepo.save(new Category({name: new CategoryName('Categoria A')}));
      const product =  await productRepo.save(Product.create({
        category_id: category.id,
        name: 'Product A',
        description: 'Descrição A',
        slug: ''
      }))

      return {
        product_id: product.id,
        url: 'https://imagem.com',
        ordem: 1
      };
}


describe('Image Use Cases Integration', () => {
  let imageRepo: InMemoryImageRepository;
  let productRepo: MockProductRepository;
  let categoryRepo: InMemoryCategoryRepository;
  let createUC: CreateImageUseCase;
  let getByIdUC: GetImageByIdUseCase;

  beforeEach(() => {
    imageRepo = new InMemoryImageRepository();
    productRepo = new MockProductRepository();
    createUC = new CreateImageUseCase(imageRepo, productRepo);
    getByIdUC = new GetImageByIdUseCase(imageRepo);
    categoryRepo = new InMemoryCategoryRepository();
  });

  describe('CreateImageUseCase', () => {
      

    it('deve criar uma imagem com sucesso quando o produto existe', async () => {

      const input = await criarProduto(categoryRepo, productRepo);

      const result = await createUC.execute(input);

      expect(result).toHaveProperty('id');
      expect(result.url).toBe(input.url);
      
      // Verifica se realmente salvou no repositório
      const savedInRepo = await imageRepo.findBy({ url: input.url });
      expect(savedInRepo).not.toBeNull();
    });

    it('deve lançar erro se a imagem já existir (URL duplicada)', async () => {
    
      const input = await criarProduto(categoryRepo, productRepo);
      
      // Salva a primeira vez
      await createUC.execute(input);

      // Tenta salvar a segunda vez com a mesma URL
      await expect(createUC.execute(input))
        .rejects.toThrow(new AppError('imagem já existe', 409));
    });

    it('deve lançar erro se o produto não for encontrado', async () => {

      const input = await criarProduto(categoryRepo, productRepo);
      input.product_id = 'outro-id-nao-valido';

      await expect(createUC.execute(input))
        .rejects.toThrow(new AppError('produto não encontrado', 404));
    });
  });

  describe('GetImageByIdUseCase', () => {
    it('deve retornar uma imagem pelo ID', async () => {
      
      
      const saved = await createUC.execute(await criarProduto(categoryRepo, productRepo));

      const found = await getByIdUC.execute(saved.id);

      expect(found.id).toBe(saved.id);
      expect(found.url).toBe('https://imagem.com');
    });

    it('deve lançar erro ao buscar ID inexistente', async () => {
      await expect(getByIdUC.execute('id-fake'))
        .rejects.toThrow(new AppError('Imagem não encontrada', 404));
    });
  });
});
