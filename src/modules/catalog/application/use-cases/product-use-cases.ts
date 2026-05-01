import { CreateProductInputDTO, ProductOutputDTO, UpdateProductInputDTO, type CreateProductImageInputDTO, type CreateSkuInputDTO } from "../dtos/product-dtos";
import { Product, type ProductType, type Visibility } from "../../domain/entities/product.entity";
import { IProductRepository, PagedProductOutput, ProductFilter } from "../interfaces/repository/IProductRepository";
import { ProductMapper } from "../dtos/product-mappers";
import { AppError } from "@shared/errors/AppError";
import { ICategoryRepository } from "../interfaces/repository/ICategoryRepository";
import type { IStockService } from "../interfaces/repository/stock-service.port";
import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";
import type { ISkuRepository } from "../interfaces/repository/ISkuRepository";
import type { IAttributeRepository } from "../interfaces/repository/IAttributeRepository";
import type { IMessageBroker } from "@shared/infra/messaging/IMessageBroker";
import type { SkuDetailsOutputDto } from "../dtos/sku-dtos";
import type { IUnitOfWork } from "../interfaces/repository/IUnitOfWork";

export class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository, 
    private categoryRepository: ICategoryRepository,
    private skuRepository: ISkuRepository,
    private attributeRepository: IAttributeRepository,
    private messageBroker: IMessageBroker,
    private unitOfWork: IUnitOfWork
  ) {}

  async execute(input: CreateProductInputDTO): Promise<string> {
    // Variáveis para transportar os dados para fora do contexto da transação
    let createdProduct: Product;

    // O Unit of Work gerencia a abertura, commit e rollback
    await this.unitOfWork.run(async () => {
      const { skus, images, ...rest } = input;

      // 1. Validações de existência
      const already_exists = await this.productRepository.findBy({ name: input.name });
      if (already_exists) throw new AppError('Produto já existe', 409);

      const category_exists = await this.categoryRepository.findBy(input.category_id);
      if (!category_exists) throw new AppError('Categoria não existe', 404);

      // 2. Validações de integridade
      this.validateInputData(images, skus);

      if (skus && skus.length > 0) {
        const skuCodes = skus.map(s => s.sku_code);
        const existingCount = await this.skuRepository.countAllByCodes(skuCodes);
        if (existingCount > 0) {
          throw new AppError('Um ou mais SKU Codes informados já estão em uso', 409);
        }
      }

      // 3. Resolução de Atributos e Criação do Agregado
      const attributeIdMap = await this.resolveAttributes(skus || []);

      const product = Product.create({
        ...rest,
        name: input.name,
        description: input.description,
        category_id: input.category_id,
        product_type: (input.product_type ?? 'simple') as ProductType,
        visibility: (input.visibility ?? 'catalog') as Visibility,
        has_variants: input.has_variants ?? false,
      });

      images?.forEach(img => product.addImage(img.url, img.ordem));

      skus?.forEach(skuDto => {
        const sku_attributes = skuDto.attributes?.map(attr => ({
          name: attr.name,
          value: attr.value,
          attribute_id: attributeIdMap.get(attr.name.toLowerCase())!
        })) || [];

        const sku = SkuDomain.create({
          ...skuDto,
          product_id: product.id,
          sku_attributes,
          initial_quantity: skuDto.initial_quantity,
          warehouse_id: skuDto.warehouse_id
        });
        product.addSku(sku);
      });

      // 4. Persistência
      // O retorno é atribuído à variável de escopo superior
      await this.productRepository.save(product);
      createdProduct = product;
    });

    // 5. Lógica Pós-Commit (Executa apenas se o unitOfWork.run terminar sem erros)
    // Agora temos a garantia de que o produto está no banco de dados
    const mappedToOutput = ProductMapper.toOutput(createdProduct!);
    
    this.publishProductEvents(createdProduct!, mappedToOutput);
    createdProduct!.clearEvents();

    return mappedToOutput.id;
  }

  private validateInputData(images?: CreateProductImageInputDTO[], skus?: CreateSkuInputDTO[]) {
    if (images) {
      const uniqueUrls = new Set(images.map(img => img.url));
      if (uniqueUrls.size !== images.length) throw new AppError('URLs de imagens duplicadas', 400);
    }
    if (skus) {
      const skuCodes = skus.map(s => s.sku_code.toUpperCase());
      if (new Set(skuCodes).size !== skus.length) throw new AppError('SKU Codes duplicados no request', 400);
    }
  }

  private async resolveAttributes(skus: CreateSkuInputDTO[]): Promise<Map<string, string>> {
    const allNames = skus.flatMap(s => s.attributes?.map(a => a.name) || []);
    const uniqueNames = [...new Set(allNames)];
    const attributeMap = new Map<string, string>();
    if (uniqueNames.length === 0) return attributeMap;

    const existingAttributes = await this.attributeRepository.findAllByName(uniqueNames);
    (existingAttributes || []).forEach(attr => {
      attributeMap.set(attr.name.toLowerCase(), attr.id);
    });

    uniqueNames.forEach(name => {
      if (!attributeMap.has(name.toLowerCase())) attributeMap.set(name.toLowerCase(), "");
    });

    return attributeMap;
  }

  private publishProductEvents(product: Product, output: ProductOutputDTO) {
    const originalSkusMap = new Map(product.skus.map(sku => [sku.id, sku]));

    output.skus?.forEach((skuOut: SkuDetailsOutputDto) => {
      const original = originalSkusMap.get(skuOut.id);
      if (original) {
        this.messageBroker.publishInExchange('catalog.sku', 'sku.created', { 
          sku: skuOut.id, 
          warehouse_id: original.warehouse_id, 
          initial_quantity: original.initial_quantity 
        });
        skuOut.quantity = original.initial_quantity
        skuOut.warehouse_id = original.warehouse_id
      }
    });

    this.messageBroker.publishInExchange('catalog.products', 'product.created', output);
  }

}

export class GetProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(prop: object): Promise<ProductOutputDTO> {
    const product = await this.productRepository.findBy(prop);

    if (!product) {
      throw new AppError("produto não encontrado", 404);
    }

    return ProductMapper.toOutput(product);
  }
}

export class ListProductsUseCase {
  constructor(private productRepository: IProductRepository, private stockService: IStockService) {}

  async execute(
    page?: number, 
    limit?: number, 
    filter?: ProductFilter
  ): Promise<PagedProductOutput> {
    const products = await this.productRepository.allPaginated(page, limit, filter);
    const skus = products.items?.flatMap(item => 
      item.skus?.map(sku => sku.id) ?? []
    ) ?? [];

    const stockData = await this.stockService.getStocksBySkus(skus);
    const stockMap = new Map(stockData.map(s=>[s.sku, s.quantity]));

    const updatedProducts = products.items.map(product => {
      return {
        ...product,
        skus: (product.skus || []).map(sku => {
          return {
            ...sku,
            quantity: stockMap.get(sku.id) ?? 0
          }
        })
      }
    });

    return {
      items: updatedProducts,
      page: products.page,
      limit: products.limit,
      total: products.total,
    }
  }
}

export class UpdateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(input: UpdateProductInputDTO): Promise<ProductOutputDTO> {
    // 1. Busca o produto original
    const product = await this.productRepository.findBy({ id: input.id });
    if (!product) throw new AppError("Produto não encontrado", 404);

    // 2. Valida categoria apenas se ela for informada no update
    if (input.category_id) {
      const category = await this.categoryRepository.findBy(input.category_id);
      if (!category) throw new AppError("Categoria não encontrada", 404);
    }

    // 3. Valida unicidade do nome (apenas se o nome mudou)
    if (input.name && input.name !== product.props.name) {
      const nameExists = await this.productRepository.findBy({ name: input.name });
      if (nameExists) throw new AppError("Já existe um produto com este nome", 409);
    }

    // 4. Delega a atualização para a entidade (Regra de Negócio)
    product.update({
      name: input.name,
      description: input.description,
      category_id: input.category_id
    });

    // 5. Persiste a instância alterada
    await this.productRepository.update(product);

    return ProductMapper.toOutput(product);
  }
}

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<{ success: boolean }> {
    const exists = await this.productRepository.findBy({id});
    
    if (!exists) {
      throw new AppError("produto não encontrado", 404);
    }

    const success = await this.productRepository.delete(id);
    return { success };
  }
}

