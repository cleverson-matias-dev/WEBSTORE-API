/*eslint-disable */
import { AppError } from "@shared/errors/AppError";
import { MockProductRepository } from "./mockProductRepository";
import { UpdateProductUseCase } from "@modules/catalog/application/use-cases/product-use-cases";
import { Product } from "@modules/catalog/domain/entities/product.entity";

describe('UpdateProductUseCase', () => {
  let productRepo: MockProductRepository;
  let categoryRepo: any;
  let sut: UpdateProductUseCase;

  beforeEach(() => {
    productRepo = new MockProductRepository();
    // Mock simples: sempre retorna a categoria como válida (objeto)
    categoryRepo = { findBy: jest.fn().mockResolvedValue({ id: 'cat-1' }) };
    sut = new UpdateProductUseCase(productRepo, categoryRepo);
  });

  const createExistingProduct = async () => {
    const product = Product.create({
      id: 'prod-123',
      name: 'Produto Original',
      description: 'Desc',
      category_id: 'cat-1',
      slug: ''
    });
    await productRepo.save(product);
    return product;
  };

  it('deve atualizar o produto com sucesso e mudar o slug', async () => {
    await createExistingProduct();

    const input = {
      id: 'prod-123',
      name: 'Novo Nome Super Legal',
      description: 'Nova Descrição'
    };

    const result = await sut.execute(input);

    expect(result.name).toBe('Novo Nome Super Legal');
    expect(result.slug).toBe('novo-nome-super-legal');
    expect(result.description).toBe('Nova Descrição');
  });

  it('deve lançar erro se o produto não existir', async () => {
    const input = { id: 'invalid-id', name: 'Qualquer' };
    
    await expect(sut.execute(input))
      .rejects.toThrow(new AppError("Produto não encontrado", 404));
  });

  it('deve lançar erro se a categoria não for encontrada', async () => {
    await createExistingProduct();
    categoryRepo.findBy.mockResolvedValue(null);

    const input = { id: 'prod-123', category_id: 'cat-inexistente' };

    await expect(sut.execute(input))
      .rejects.toThrow(new AppError("Categoria não encontrada", 404));
  });

  it('deve lançar erro se tentar mudar o nome para um que já existe em outro produto', async () => {
    await createExistingProduct();
    await productRepo.save(Product.create({
      id: 'prod-456',
      name: 'Nome Duplicado',
      description: 'Outro',
      category_id: 'cat-1',
      slug: ''
    }));

    const input = { id: 'prod-123', name: 'Nome Duplicado' };

    await expect(sut.execute(input))
      .rejects.toThrow(new AppError("Já existe um produto com este nome", 409));
  });
});
