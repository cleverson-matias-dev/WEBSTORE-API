import { SkuAttributeValue } from "@modules/catalog/domain/entities/sku-attribute-value";
import { 
  CreateSkuAttributeValueRequestDTO, 
  SkuAttributeValueResponseDTO, 
  UpdateSkuAttributeValueRequestDTO 
} from "../dtos/sku-attribute-value-dtos";
import { ISkuAttributeValueRepository } from "../interfaces/repository/ISkuAttributeValueRepository";
import { AppError } from "@shared/errors/AppError";

export class SkuAttributeValueService {
  constructor(private readonly repo: ISkuAttributeValueRepository) {}

  /**
   * Atribui um novo atributo ao SKU (Create)
   */
  async assignAttribute(data: CreateSkuAttributeValueRequestDTO): Promise<SkuAttributeValueResponseDTO> {
    const exists = await this.repo.findBySkuAndAttribute(data.sku_id, data.attribute_id);
    if (exists) throw new AppError("Este atributo já está definido para este SKU.", 409);

    try {
      const attributeValue = SkuAttributeValue.create(data);
      await this.repo.save(attributeValue);

      return this.mapToResponse(attributeValue);
    } catch (error) {
      throw new AppError('Falha ao processar requisição');
    }
    
  }

  /**
   * Atualiza o valor de um atributo existente (Update)
   */
  async updateValue(data: UpdateSkuAttributeValueRequestDTO): Promise<SkuAttributeValueResponseDTO> {
    const attributeValue = await this.repo.findById(data.id);
    if (!attributeValue) throw new AppError("Atributo de SKU não encontrado.", 404);

    try {
      attributeValue.changeValue(data.new_value);
      await this.repo.update(attributeValue);

      return this.mapToResponse(attributeValue);
    } catch (error) {
      throw new AppError('Erro ao processar requisição');
    }
    
  }

  /**
   * Lista todos os atributos de um SKU específico (Read)
   */
  async listBySku(skuId: string): Promise<SkuAttributeValueResponseDTO[]> {
    try {
      const items = await this.repo.findAllBySku(skuId);
      return items.map(item => this.mapToResponse(item));
    } catch (error) {
       throw new AppError('Erro ao processar requisição');
    }
    
  }

  /**
   * Remove o vínculo de um atributo com um SKU (Delete)
   */
  async remove(id: string): Promise<void> {
    const attributeValue = await this.repo.findById(id);
    if (!attributeValue) {
      throw new AppError("Atributo de SKU não encontrado para remoção.", 404);
    }

    try {
      await this.repo.delete(id);
    } catch (error) {
      throw new AppError('Erro ao processar requisição')
    }
    
  }

  /**
   * Mapper privado para padronizar as respostas (D.R.Y)
   */
  private mapToResponse(entity: SkuAttributeValue): SkuAttributeValueResponseDTO {
    return {
      id: entity.id,
      sku_id: entity.skuId,
      attribute_id: entity.attribute_id,
      value: entity.value,
      updated_at: entity.updatedAt
    };
  }
}
