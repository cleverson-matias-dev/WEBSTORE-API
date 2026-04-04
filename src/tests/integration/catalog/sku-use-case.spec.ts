import { SkuUseCases } from "@modules/catalog/application/use-cases/sku-use-cases";
import { MockSkuRepository } from "./mockSkuRepository";
import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";
import { Price, SkuCode, Weight } from "@modules/catalog/domain/value-objects/sku.vo";
import { MockProductRepository } from "./mockProductRepository";
import { Product } from "@modules/catalog/domain/entities/product.entity";
import { MockCategoryRepository } from "./mockCategoriaRepository";
import { Category } from "@modules/catalog/domain/entities/category.entity";
import { CategoryName } from "@modules/catalog/domain/value-objects/category.name.vo";

describe("SkuUseCases Unit Tests", () => {
  let repository: MockSkuRepository;
  let useCases: SkuUseCases;
  let mockProductRepository: MockProductRepository;
  let mockCategoryRepository: MockCategoryRepository;

  // Variáveis globais para os testes utilizarem
  let defaultCategory: Category;
  let defaultProduct: Product;

  beforeEach(async () => {
    repository = new MockSkuRepository();
    mockProductRepository = new MockProductRepository();
    mockCategoryRepository = new MockCategoryRepository();
    useCases = new SkuUseCases(repository, mockProductRepository);

    // Setup inicial: Cria categoria e produto uma única vez por teste
    defaultCategory = await mockCategoryRepository.save(
      new Category({ name: new CategoryName('Categoria Padrão') })
    );

    defaultProduct = await mockProductRepository.save(
      Product.create({
        category_id: defaultCategory.id,
        name: 'Produto Padrão',
        description: 'Descrição Padrão',
        slug: ''
      })
    );
  });

  describe("create", () => {
    it("deve criar um novo SKU com sucesso", async () => {
      const input = {
        product_id: defaultProduct.id,
        sku_code: "TSHIRT-BLUE-L",
        price: 49.9,
        currency: "BRL",
        weight: 200,
        dimensions: "20x20x5",
      };

      const result = await useCases.create(input);

      expect(result.id).toBeDefined();
      expect(result.sku_code).toBe("TSHIRT-BLUE-L");
      
      const saved = await repository.findById(result.id);
      expect(saved).toBeDefined();
      expect(saved?.price).toBe(49.9);
    });

    it("deve lançar erro se o SKU Code já existir", async () => {
      const input = {
        product_id: defaultProduct.id,
        sku_code: "EXISTING",
        price: 10,
        weight: 100,
        dimensions: "1x1x1",
      };

      await useCases.create(input);
      await expect(useCases.create(input)).rejects.toThrow("SKU Code já cadastrado.");
    });
  });

  describe("updatePrice", () => {
    it("deve atualizar o preço de um SKU existente", async () => {
      const sku = new SkuDomain({
        productId: defaultProduct.id,
        skuCode: new SkuCode("PRICE-TEST"),
        price: new Price(100),
        weight: new Weight(500),
        dimensions: "10x10x10",
      });
      await repository.create(sku);

      const updated = await useCases.updatePrice({
        id: sku.id,
        new_price: 150,
      });

      expect(updated.price).toBe(150);
    });
  });

  describe("updateLogistics", () => {
    it("deve atualizar peso e dimensões", async () => {
      const sku = new SkuDomain({
        productId: defaultProduct.id,
        skuCode: new SkuCode("LOG-TEST"),
        price: new Price(10),
        weight: new Weight(100),
        dimensions: "old",
      });
      await repository.create(sku);

      const result = await useCases.updateLogistics({
        id: sku.id,
        weight: 900,
        dimensions: "new-dims",
      });

      expect(result.weight).toBe(900);
      expect(result.dimensions).toBe("new-dims");
    });
  });

  describe("delete", () => {
    it("deve remover um SKU do repositório", async () => {
      const sku = new SkuDomain({
        productId: defaultProduct.id,
        skuCode: new SkuCode("DEL-123"),
        price: new Price(10),
        weight: new Weight(100),
        dimensions: "dim",
      });
      await repository.create(sku);

      await useCases.delete(sku.id);
      expect(await repository.findById(sku.id)).toBeNull();
    });
  });

  describe("getById", () => {
    it("deve retornar os detalhes de um SKU", async () => {
      const sku = new SkuDomain({
        productId: defaultProduct.id,
        skuCode: new SkuCode("GET-123"),
        price: new Price(25),
        weight: new Weight(200),
        dimensions: "5x5x5",
      });
      await repository.create(sku);

      const result = await useCases.getById(sku.id);
      expect(result.sku_code).toBe("GET-123");
      expect(result.product_id).toBe(defaultProduct.id);
    });
  });
});
