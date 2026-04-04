import { CreateProductInputDTO, ProductOutputDTO, UpdateProductInputDTO } from "../dtos/product-dtos";
import { Product } from "../../domain/entities/product.entity";
import { IProductRepository, PagedProductOutput, ProductFilter } from "../interfaces/repository/IProductRepository";
import { ProductMapper } from "../dtos/product-mappers";
import { AppError } from "@shared/errors/AppError";
import { ICategoryRepository } from "../interfaces/repository/ICategoryRepository";

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(input: CreateProductInputDTO): Promise<ProductOutputDTO> {
    const product = Product.create({
      name: input.name,
      description: input.description,
      category_id: input.category_id,
      slug: "" 
    });

    try {
        const savedProduct = await this.productRepository.save(product);
        return ProductMapper.toOutput(savedProduct);
    } catch (error: any) {
        if(error.code === 'ER_DUP_ENTRY') throw new AppError('produto já existe', 409)
        if(error.errno === 1452) throw new AppError('categoria não encontrada', 404)
        throw new AppError('Erro interno do servidor', 400)
    }
    
  }
}

export class GetProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(prop: {}): Promise<ProductOutputDTO> {
    const product = await this.productRepository.findBy(prop);

    if (!product) {
      throw new AppError("produto não encontrado", 404);
    }

    return ProductMapper.toOutput(product);
  }
}

export class ListProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(
    page?: number, 
    limit?: number, 
    filter?: ProductFilter
  ): Promise<PagedProductOutput> {
    return await this.productRepository.allPaginated(page, limit, filter);
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

