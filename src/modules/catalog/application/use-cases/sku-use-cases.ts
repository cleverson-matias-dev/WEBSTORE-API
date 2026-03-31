import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";
import { CreateSkuInputDto, CreateSkuOutputDto, SkuDetailsOutputDto, UpdateLogisticsInputDto, UpdatePriceInputDto } from "../dtos/sku-dtos";
import { ISkuRepository } from "../interfaces/repository/ISkuRepository";
import { Price, SkuCode, Weight } from "@modules/catalog/domain/value-objects/sku.vo";
import { SkuMapper } from "../dtos/sku-mapper";
import { AppError } from "@shared/errors/AppError";
import { IProductRepository } from "../interfaces/repository/IProductRepository";
import { Product } from "@modules/catalog/domain/entities/product.entity";

export class SkuUseCases {
  constructor(
    private readonly skuRepository: ISkuRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async create(input: CreateSkuInputDto): Promise<CreateSkuOutputDto> {
    const alreadyExists = await this.skuRepository.findByCode(input.skuCode);
    if (alreadyExists) throw new AppError("SKU Code já cadastrado.", 409);

    const productExists = await this.productRepository.findBy({ id:input.productId });
    if(!(productExists instanceof Product)) throw new AppError('produto não encontrado', 404);

    const sku = new SkuDomain({
      productId: input.productId,
      skuCode: new SkuCode(input.skuCode),
      price: new Price(input.price, input.currency),
      weight: new Weight(input.weight),
      dimensions: input.dimensions,
    });

    try {
       await this.skuRepository.create(sku);
       return SkuMapper.toOutput(sku);
    } catch (error) {
       throw new AppError('Erro na requisição');
    }
    
  }

  async getByProductId(productId: string): Promise<SkuDetailsOutputDto[]> {

    try {
      const skus = await this.skuRepository.findByProductId(productId);
      return skus.map(sku => SkuMapper.toOutput(sku));
    } catch (error) {
      throw new AppError('Erro na requisição');
    }
    
  }

  async updatePrice(input: UpdatePriceInputDto): Promise<SkuDetailsOutputDto> {
    const sku = await this.findByIdOrThrow(input.id);
    
    try {
       sku.changePrice(new Price(input.newPrice, input.currency));
       await this.skuRepository.update(sku);
       return SkuMapper.toOutput(sku);
    } catch (error) {
      throw new AppError('Falha na requisição');
    }
   
  }

  async updateLogistics(input: UpdateLogisticsInputDto): Promise<SkuDetailsOutputDto> {
    const sku = await this.findByIdOrThrow(input.id);
    
    try {
      sku.updateLogistics(new Weight(input.weight), input.dimensions);
      await this.skuRepository.update(sku);
      return SkuMapper.toOutput(sku);
    } catch (error) {
      throw new AppError("Falha na requisição");
    }
    
  }

  async delete(id: string): Promise<void> {
    await this.findByIdOrThrow(id);

    try {
      await this.skuRepository.delete(id);
    } catch (error) {
      throw new AppError('Erro na requisição')
    }
    
  }

  async getById(id: string): Promise<SkuDetailsOutputDto> {
    const sku = await this.findByIdOrThrow(id);
    return SkuMapper.toOutput(sku);
  }

  private async findByIdOrThrow(id: string): Promise<SkuDomain> {
    const sku = await this.skuRepository.findById(id);
    if (!sku) throw new AppError("SKU não encontrado.", 404);
    return sku;
  }

}
