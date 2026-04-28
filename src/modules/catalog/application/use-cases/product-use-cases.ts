import { CreateProductInputDTO, ProductOutputDTO, UpdateProductInputDTO, type CreateSkuInputDTO } from "../dtos/product-dtos";
import { Product, type ProductType, type Visibility } from "../../domain/entities/product.entity";
import { IProductRepository, PagedProductOutput, ProductFilter } from "../interfaces/repository/IProductRepository";
import { ProductMapper } from "../dtos/product-mappers";
import { AppError } from "@shared/errors/AppError";
import { ICategoryRepository } from "../interfaces/repository/ICategoryRepository";
import type { IStockService } from "../interfaces/repository/stock-service.port";
import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";
import type { ISkuRepository } from "../interfaces/repository/ISkuRepository";
import type { IImageRepository } from "../interfaces/repository/IImageRepository";
import type { IAttributeRepository } from "../interfaces/repository/IAttributeRepository";
import type { IMessageBroker } from "@shared/infra/messaging/IMessageBroker";

export class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository, 
    private categoryRepository: ICategoryRepository,
    private skuRepository: ISkuRepository,
    private imageRepository: IImageRepository,
    private attributeRepository: IAttributeRepository,
    private messageBroker: IMessageBroker
  ) {}

  async execute(input: CreateProductInputDTO): Promise<ProductOutputDTO> {
    const { skus, images, ...rest } = input;

    // 1. Validações de existência
    const already_exists = await this.productRepository.findBy({ name: input.name });
    if (already_exists) throw new AppError('Produto já existe', 409);
    
    const category_exists = await this.categoryRepository.findBy(input.category_id);
    if (!category_exists) throw new AppError('Categoria não existe', 404);
    
    
    
    if (images) {
      const uniqueUrls = new Set(images.map(img => img.url));
      if (uniqueUrls.size !== images.length) {
        throw new AppError('Existem URLs de imagens duplicadas no request', 400);
      }
    }
    
    if (skus) {
      const skuCodes = skus.map(s => s.sku_code.toUpperCase());
      const uniqueSkus = new Set(skuCodes);
      if (uniqueSkus.size !== skus.length) {
        throw new AppError('Existem SKU Codes duplicados no mesmo produto', 400);
      }
    }
    
    if (skus && skus.length > 0) {
      const skuCodes = skus.map(s => s.sku_code);
      
      const existingCount = await this.skuRepository.countAllByCodes(skuCodes);
      
      if (existingCount > 0) {
        throw new AppError(
          'Um ou mais SKU Codes informados já estão em uso em outros produtos', 
          409
        );
      }
    }
    
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

    if (images) {
      for(const image of images) {
        const imageExists = await this.imageRepository.findBy({ url: image.url, product_id: product.id})
        if(imageExists) throw new AppError("Essa imagem já foi cadastrada para esse produto!", 409);
      }
    }

    images?.forEach(img => {
      product.addImage(img.url, img.ordem);
    });

    skus?.forEach(skuDto => {

      if (skuDto.attributes && skuDto.attributes.length > 0) {
        const attributeNames = skuDto.attributes.map(a => a.name.toLowerCase());
        const uniqueNames = new Set(attributeNames);
        
        if (uniqueNames.size !== attributeNames.length) {
          throw new AppError(`O SKU ${skuDto.sku_code} possui atributos duplicados (ex: dois atributos com o mesmo nome).`, 400);
        }
      }

      const sku_attributes = skuDto.attributes?.map(attr => ({
        name: attr.name,
        value: attr.value,
        attribute_id: attributeIdMap.get(attr.name.toLowerCase())!
      })) || [];

      const sku = SkuDomain.create({
        ...skuDto,
        product_id: product.id,
        sku_attributes
      });
      
      product.addSku(sku);
    });

    try {
      const savedProduct = await this.productRepository.save(product);
      product.domainEvents.forEach(event => {
        this.messageBroker.publishInExchange('catalog.products', event.type, event.data);
      })
      product.clearEvents();
      return ProductMapper.toOutput(savedProduct);
    } catch (error) {
      console.error(error);
      throw new AppError('Erro interno ao processar o produto', 500);
    }
  }

  private async resolveAttributes(skus: CreateSkuInputDTO[]): Promise<Map<string, string>> {
    // 1. Extrai nomes únicos (normalizados para evitar duplicidade por case sensitive)
    const allNames = skus.flatMap(s => s.attributes?.map(a => a.name) || []);
    const uniqueNames = [...new Set(allNames)];
    
    if (uniqueNames.length === 0) return new Map();

    const attributeMap = new Map<string, string>();

    // 2. Busca todos de uma vez (melhor performance que loop com await)
    for (const name of uniqueNames) {
      const attr = await this.attributeRepository.findByName(name);
      
      // 3. Se encontrar, mapeia o ID. Se não, mapeia string vazia.
      // O cascade cuidará da criação dos que estiverem vazios no momento do save.
      attributeMap.set(name.toLowerCase(), attr ? attr.id : "");
    }

    return attributeMap;
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

