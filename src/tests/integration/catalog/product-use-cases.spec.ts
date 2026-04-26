import { CreateProductUseCase, DeleteProductUseCase, GetProductUseCase, ListProductsUseCase, UpdateProductUseCase } from "@modules/catalog/application/use-cases/product-use-cases";
import { InMemoryCategoryRepository } from "./mockCategoryRepository";
import { MockProductRepository } from "./mockProductRepository";
import { Category } from "@modules/catalog/domain/entities/category.entity";
import { CategoryName } from "@modules/catalog/domain/value-objects/category.name.vo";


describe("Product Use Cases", () => {
    let productRepo: MockProductRepository;
    let categoryRepo: InMemoryCategoryRepository;
    
    // SUTs (System Under Test)
    let createProductUseCase: CreateProductUseCase;
    let getProductUseCase: GetProductUseCase;
    let listProductsUseCase: ListProductsUseCase;
    let updateProductUseCase: UpdateProductUseCase;
    let deleteProductUseCase: DeleteProductUseCase;
    let categoryId = '';

    const mockStockService = {
        getStocksBySkus: jest.fn().mockResolvedValue([{sku:'', quantity: 0}])
    }

    beforeEach(async () => {
        productRepo = new MockProductRepository();
        categoryRepo = new InMemoryCategoryRepository();

        // Setup inicial: criar uma categoria para os produtos
        const category = new Category({
            name: new CategoryName("Eletrônicos"),
            slug: "eletronicos"
        });
        categoryId = (await categoryRepo.save(category)).id;

        createProductUseCase = new CreateProductUseCase(productRepo, categoryRepo);
        getProductUseCase = new GetProductUseCase(productRepo);
        listProductsUseCase = new ListProductsUseCase(productRepo, mockStockService);
        updateProductUseCase = new UpdateProductUseCase(productRepo, categoryRepo);
        deleteProductUseCase = new DeleteProductUseCase(productRepo);
    });

    describe("CreateProductUseCase", () => {
        it("deve criar um produto com sucesso", async () => {
            const input = {
                name: "iPhone 15",
                description: "Smartphone Apple",
                category_id: categoryId
            };

            const result = await createProductUseCase.execute(input);

            expect(result.id).toBeDefined();
            expect(result.name).toBe(input.name);
            expect(result.slug).toBe("iphone-15");
        });

        it("deve lançar erro se o produto já existir", async () => {
            const input = { name: "Repetido", description: "...", category_id: categoryId };
            await createProductUseCase.execute(input);

            await expect(createProductUseCase.execute(input))
                .rejects.toThrow("Produto já existe");
        });

        it("deve lançar erro se a categoria não existir", async () => {
            const input = { name: "Novo", description: "...", category_id: "invalid-id" };

            await expect(createProductUseCase.execute(input))
                .rejects.toThrow("Categoria não existe");
        });
    });

    describe("UpdateProductUseCase", () => {
        it("deve atualizar o nome sem alterar slug do produto", async () => {
            // Primeiro cria um produto
            const created = await createProductUseCase.execute({
                name: "Nome Antigo",
                description: "Desc",
                category_id: categoryId
            });

            const updateInput = {
                id: created.id,
                name: "Nome Novo",
                slug: "nome-novo"
            };

            const result = await updateProductUseCase.execute(updateInput);

            expect(result.name).toBe("Nome Novo");
            expect(result.slug).toBe("nome-antigo");
        });

        it("deve lançar erro ao tentar atualizar produto inexistente", async () => {
            await expect(updateProductUseCase.execute({ id: "non-existent", name: "Novo" }))
                .rejects.toThrow("Produto não encontrado");
        });
    });

    describe("List e Get UseCases", () => {
        it("deve listar produtos paginados", async () => {
            await createProductUseCase.execute({ name: "Prod 1", description: "D1", category_id: categoryId });
            await createProductUseCase.execute({ name: "Prod 2", description: "D2", category_id: categoryId });

            const result = await listProductsUseCase.execute(1, 10);

            expect(result.items.length).toBe(2);
            expect(result.total).toBe(2);
        });

        it("deve buscar um produto por ID", async () => {
            const created = await createProductUseCase.execute({ name: "Unico", description: "D", category_id: categoryId });
            
            const result = await getProductUseCase.execute({ id: created.id });

            expect(result.id).toBe(created.id);
            expect(result.name).toBe("Unico");
        });
    });

    describe("DeleteProductUseCase", () => {
        it("deve deletar um produto", async () => {
            const created = await createProductUseCase.execute({ name: "Deletar", description: "D", category_id: categoryId });
            
            const result = await deleteProductUseCase.execute(created.id);

            expect(result.success).toBe(true);
            await expect(getProductUseCase.execute({ id: created.id }))
                .rejects.toThrow("produto não encontrado");
        });
    });
});
