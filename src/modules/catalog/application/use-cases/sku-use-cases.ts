import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";
import { CreateSkuInputDto, CreateSkuOutputDto, SkuDetailsOutputDto, UpdateLogisticsInputDto, UpdatePriceInputDto, type DomainWithStock, type SkuCreatedEventDTO } from "../dtos/sku-dtos";
import { ISkuRepository } from "../interfaces/repository/ISkuRepository";
import { Price, SkuCode, Weight } from "@modules/catalog/domain/value-objects/sku.vo";
import { SkuMapper } from "../dtos/sku-mapper";
import { AppError } from "@shared/errors/AppError";
import { IProductRepository } from "../interfaces/repository/IProductRepository";
import { Product } from "@modules/catalog/domain/entities/product.entity";
import RabbitMQServer from "@shared/infra/messaging/RabbitMQServer";
import type { IStockService } from "../interfaces/repository/stock-service.port";

export class SkuUseCases {
  constructor(
    private readonly skuRepository: ISkuRepository,
    private readonly productRepository: IProductRepository,
    private readonly stockService: IStockService
  ) {}

  async create(input: CreateSkuInputDto): Promise<CreateSkuOutputDto> {
    const alreadyExists = await this.skuRepository.findByCode(input.sku_code);
    if (alreadyExists) throw new AppError("SKU Code já cadastrado.", 409);

    const productExists = await this.productRepository.findBy({ id:input.product_id });
    if(!(productExists instanceof Product)) throw new AppError('produto não encontrado', 404);

    const sku = new SkuDomain({
      productId: input.product_id,
      skuCode: new SkuCode(input.sku_code),
      price: new Price(input.price, input.currency),
      weight: new Weight(input.weight),
      dimensions: input.dimensions,
    });

    try {
       await this.skuRepository.create(sku);

       const skuCreatedEvent: SkuCreatedEventDTO = {
           sku: sku.id,
           warehouse_id: input.warehouse_id,
           initial_quantity: input.initial_quantity
       }
       await RabbitMQServer.getInstance()
       .publishInExchange('catalog.sku', 'sku.created', skuCreatedEvent);

       return SkuMapper.toOutput(sku, input.initial_quantity);
    } catch (error) {
       console.log(error)
       throw new AppError('Erro na requisição');
    }
    
  }

  async getByProductId(productId: string): Promise<SkuDetailsOutputDto[]> {

    try {
      const skus = await this.skuRepository.findByProductId(productId);
      const skusWithStock = await this.getStockData(skus);
      return skusWithStock.map(sku => SkuMapper.toOutputWithStock(sku));
    } catch (error) {
      console.log(error)
      throw new AppError('Erro na requisição');
    }
    
  }

  async updatePrice(input: UpdatePriceInputDto): Promise<SkuDetailsOutputDto> {
    const sku = await this.findByIdOrThrow(input.id);
    
    try {
       sku.changePrice(new Price(input.new_price, input.currency));
       await this.skuRepository.update(sku);
       const skusWithStock = await this.getStockData([sku]);
       return SkuMapper.toOutputWithStock(skusWithStock[0]);
    } catch (error) {
      console.log(error)
      throw new AppError('Falha na requisição');
    }
   
  }

  async updateLogistics(input: UpdateLogisticsInputDto): Promise<SkuDetailsOutputDto> {
    const sku = await this.findByIdOrThrow(input.id);
    
    try {
      sku.updateLogistics(new Weight(input.weight), input.dimensions);
      await this.skuRepository.update(sku);
      const skusWithStock = await this.getStockData([sku]);
      return SkuMapper.toOutputWithStock(skusWithStock[0]);
    } catch (error) {
      console.log(error)
      throw new AppError("Falha na requisição");
    }
    
  }

  async delete(id: string): Promise<void> {
    await this.findByIdOrThrow(id);

    try {
      await this.skuRepository.delete(id);
    } catch (error) {
      console.log(error)
      throw new AppError('Erro na requisição')
    }
    
  }

  async getById(id: string): Promise<SkuDetailsOutputDto> {
    try {
      const sku = await this.findByIdOrThrow(id);
      if(!sku) throw new AppError("SKU não encontrado.", 404);
      const skusWithStock = await this.getStockData([sku]);
      return SkuMapper.toOutputWithStock(skusWithStock[0]);
    } catch(error) {
      console.log(error);
      throw new AppError('Erro ao buscar SKUs');
    }
    
  }

  private async findByIdOrThrow(id: string): Promise<SkuDomain> {
    const sku = await this.skuRepository.findById(id);
    if (!sku) throw new AppError("SKU não encontrado.", 404);
    return sku;
  }

  private async getStockData(skus: SkuDomain[]): Promise<DomainWithStock[]> {
    const stockData = await this.stockService.getStocksBySkus(skus.map(sku => sku.id));
      const stockMap = new Map(stockData.map(s=>[s.sku, s.quantity]));
      return  skus.map(sku => ({
        ...sku.toJSON(),
        quantity: stockMap.get(sku.id) ?? 0
      } as unknown as DomainWithStock))

  }

}
