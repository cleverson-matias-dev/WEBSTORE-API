import { CreateImageUseCase } from "@modules/catalog/application/use-cases/imgage-use-cases";
import { MockImageRepository } from "./mockImageRepository";
import { MockProductRepository } from "./mockProductRepository";
import { Product } from "@modules/catalog/domain/entities/product.entity";
import { CreateImageDTO } from "@modules/catalog/application/dtos/image-dtos";


describe('CreateImageUseCase', () => {
  let useCase: CreateImageUseCase;
  let imageRepository: MockImageRepository;
  let productRepository: MockProductRepository;

  beforeEach(() => {
    // Instanciando os adaptadores de teste (Mocks)
    imageRepository = new MockImageRepository();
    productRepository = new MockProductRepository();
    
    // Injeção de dependência via construtor
    useCase = new CreateImageUseCase(imageRepository, productRepository);
  });

    it('deve criar uma imagem com sucesso quando o produto existir', async () => {
      // 1. Arrange: Criar e salvar um produto no mock para simular existência no banco
      const produtoId = 'uuid-v4-do-produto';
      const produtoValido = Product.create({
      id: 'uuid-123',
      name: 'Produto Teste',
      description: '...',
      category_id: '...',
      slug: 'produto-teste'
    });

    await productRepository.save(produtoValido);

    const input: CreateImageDTO = {
      produto_id: produtoId,
      url: 'https://minhaloja.com',
      ordem: 1,
    };

    // 2. Act: Executar o caso de uso
    const result = await useCase.execute(input);

    // 3. Assert: Verificar o retorno do DTO
    expect(result).toHaveProperty('id');
    expect(result.url).toBe(input.url);
    expect(result.produto_id).toBe(produtoId);

    // 4. Assert: Verificar se o estado foi alterado no "banco em memória" (Hexagonal)
    const savedInMock = await imageRepository.findBy({ id: result.id });
    expect(savedInMock).toBeDefined();
    expect(savedInMock?.url).toBe(input.url);
  });

  it('deve lançar erro se tentar criar imagem para um produto inexistente', async () => {
  const input: CreateImageDTO = {
    produto_id: 'id-que-nao-existe',
    url: 'https://minhaloja.com',
    ordem: 1,
  };

  // Alterado de 'Produto' para 'produto' para bater com o throw do seu código
  await expect(useCase.execute(input)).rejects.toThrow('/produto não encontrado/i');
});


  it('deve garantir que a ordem da imagem seja persistida corretamente', async () => {
    // Arrange
    const produtoId = 'uuid-123';
    await productRepository.save(Product.create({ 
      id: produtoId, name: 'Mouse', description: '...', category_id: '...', slug: 'mouse' 
    }));

    const input: CreateImageDTO = {
      produto_id: produtoId,
      url: 'https://img.com',
      ordem: 5,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.ordem).toBe(5);
    const imageInDb = await imageRepository.findBy({ id: result.id });
    expect(imageInDb?.props_read_only.ordem).toBe(5);
  });
});
