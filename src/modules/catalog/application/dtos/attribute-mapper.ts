import { Attribute } from "../../domain/entities/attribute.entity";
import { AttributeDTO } from "./attribute-dtos";

export class AttributeMapper {
    static toDTO(attribute: Attribute): AttributeDTO {
        return {
            id: attribute.id!,
            name: attribute.name,
            created_at: attribute.createdAt,
            updated_at: attribute.updatedAt!
        };
    }
}