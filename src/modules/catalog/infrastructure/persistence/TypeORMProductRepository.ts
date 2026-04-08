import { Repository, Like } from "typeorm";
import { Product } from "@modules/catalog/domain/entities/product.entity";
import { Produto as ProdutoEntity } from "@modules/catalog/infrastructure/persistence/entities/ProductEntity";
import { IProductRepository, PagedProductOutput, ProductFilter } from "@modules/catalog/application/interfaces/repository/IProductRepository";
import { ProductMapper } from "@modules/catalog/application/dtos/product-mappers";
import { AppDataSource } from "@shared/infra/db/data-source";

export class TypeormProductRepository implements IProductRepository {
  
  private readonly ormRepository: Repository<ProdutoEntity> = AppDataSource.getRepository(ProdutoEntity);

  async save(product: Product): Promise<Product> {
    console.log('chegou aqui save')
    const raw = ProductMapper.toPersistence(product);
    const saved = await this.ormRepository.save(raw);
    return ProductMapper.toDomain(saved);
  }

  async findBy(prop: object): Promise<Product | null> {
    const raw = await this.ormRepository.findOne({ 
      where: {...prop}, 
      relations: {
        images: true,
        category: { parent: true }
      }});
    return raw ? ProductMapper.toDomain(raw) : null;
  }

  async allPaginated(
    page: number = 1, 
    limit: number = 10, 
    filter?: ProductFilter
  ): Promise<PagedProductOutput> {
    const skip = (page - 1) * limit;
    
    // eslint-disable-next-line
    const where: any = {};
    if (filter?.name) where.name = Like(`%${filter.name}%`);
    if (filter?.slug) where.slug = filter.slug;
    if (filter?.description) where.description = Like(`%${filter.description}%`);

    const [items, total] = await this.ormRepository.findAndCount({
      where,
      take: limit,
      skip,
      order: { created_at: "DESC" },
      relations: {
        images: true,
        category: {
          parent: true
        }
      }
    });

    return {
      items: items.map(item => ProductMapper.toOutput(ProductMapper.toDomain(item))),
      total,
      page: page,
      limit
    };
  }

  async update(product: Product): Promise<boolean> {
    const raw = ProductMapper.toPersistence(product);
    const result = await this.ormRepository.update(product.props.id!, raw);
    return result.affected! > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.ormRepository.delete(id);
    return result.affected! > 0;
  }
}
