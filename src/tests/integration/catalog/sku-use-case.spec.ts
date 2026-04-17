import { SkuUseCases } from "@modules/catalog/application/use-cases/sku-use-cases";
import { InMemorySkuRepository } from "./mockSkuRepository";
import { CreateSkuInputDto } from "@modules/catalog/application/dtos/sku-dtos";
import { AppError } from "@shared/errors/AppError";
import { MockProductRepository } from "./mockProductRepository";
import { Product } from "@modules/catalog/domain/entities/product.entity";
import { Category } from "@modules/catalog/domain/entities/category.entity";
import { CategoryName } from "@modules/catalog/domain/value-objects/category.name.vo";
import { InMemoryCategoryRepository } from "./mockCategoryRepository";
import RabbitMQServer from "@shared/infra/messaging/RabbitMQServer";

jest.mock('@shared/infra/messaging/RabbitMQServer', () => {
  return {
    __esModule: true,
    default: {
      getInstance: jest.fn().mockReturnValue({
        // Simulamos o método que você usa no código
        publishInExchange: jest.fn().mockResolvedValue(true)
      })
    }
  };
});

describe('SkuUseCases (Unit Tests)', () => {
  let skuRepository: InMemorySkuRepository;
  const productRepository = new MockProductRepository();
  const categoryRepository = new InMemoryCategoryRepository();
  let sut: SkuUseCases;

  beforeEach(async () => {

    skuRepository = new InMemorySkuRepository();
    sut = new SkuUseCases(skuRepository, productRepository);
    
  });

  const makeValidInput = async (): Promise<CreateSkuInputDto> => {
    const cat = await categoryRepository.save(new Category({name: new CategoryName('Roupas')}));
    const prod = await productRepository.save(Product.create({
      category_id: cat.id,
      name: 'produto A',
      description: 'Descrição A',
      slug: ''
    }));

    return {
    product_id: prod.id,
    sku_code: 'TSHIRT-BLACK-G',
    price: 50,
    currency: 'BRL',
    weight: 300,
    dimensions: '10x10x10',
    initial_quantity: 0,
    warehouse_id: 'jçalkdsjf-çalsdjkf-alsdkfj-asdfaaa'
  }};

  describe('create', () => {
    it('deve criar um SKU com sucesso', async () => {
      const input = await makeValidInput();
      const output = await sut.create(input);

      const rabbitInstance = RabbitMQServer.getInstance();
      expect(rabbitInstance.publishInExchange).toHaveBeenCalledWith(
        'catalog.sku',
        'sku.created',
        expect.objectContaining({ warehouse_id: 'jçalkdsjf-çalsdjkf-alsdkfj-asdfaaa' })
      );

      expect(output).toBeDefined();
      expect(output.sku_code).toBe('TSHIRT-BLACK-G');
      
      const savedInRepo = await skuRepository.findByCode('TSHIRT-BLACK-G');
      expect(savedInRepo).not.toBeNull();
    });

    it('deve lançar erro se o SKU Code já existir', async () => {
      const input = await makeValidInput();
      await sut.create(input); // Criar o primeiro

      // Tentar criar o segundo com mesmo código
      await expect(sut.create(input)).rejects.toThrow(
        new AppError("SKU Code já cadastrado.", 409)
      );
    });

    it('deve lançar erro se o produto não for encontrado', async () => {
      const input = {
        product_id: 'qualquer um ',
        sku_code: 'TSHIRT-BLACK-G',
        price: 50,
        currency: 'BRL',
        weight: 300,
        dimensions: '10x10x10',
        warehouse_id: 'açdslkf-alsdkf-açlsdkf-alsdfas',
        initial_quantity: 0
      }

      await expect(sut.create(input)).rejects.toThrow(
        new AppError('produto não encontrado', 404)
      );
    });
  });

  describe('updatePrice', () => {
    it('deve atualizar o preço de um SKU existente', async () => {
      // Setup: criar um SKU inicial
      const created = await sut.create(await makeValidInput());

      const updateInput = {
        id: created.id,
        new_price: 150,
        currency: 'USD'
      };

      const output = await sut.updatePrice(updateInput);

      expect(output.price).toBe(150);
      expect(output.currency).toBe('USD');
      
      const updatedInRepo = await skuRepository.findById(created.id);
      expect(updatedInRepo?.price).toBe(150);
    });

    it('deve lançar erro ao tentar atualizar SKU inexistente', async () => {
      await expect(sut.updatePrice({ id: 'invalid-id', new_price: 10 }))
        .rejects.toThrow(new AppError("SKU não encontrado.", 404));
    });
  });

  describe('delete', () => {
    it('deve remover um SKU do repositório', async () => {
      const created = await sut.create(await makeValidInput());
      
      await sut.delete(created.id);
      
      const found = await skuRepository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('getById', () => {
    it('deve retornar os detalhes de um SKU', async () => {
      const created = await sut.create(await makeValidInput());
      const output = await sut.getById(created.id);

      expect(output.id).toBe(created.id);
      expect(output.sku_code).toBe('TSHIRT-BLACK-G');
    });
  });
});
