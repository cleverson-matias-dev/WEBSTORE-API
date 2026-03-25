import { Attribute } from "../../domain/entities/attribute.entity";
import { AttributeDTO } from "./attribute-dtos";

export class AttributeMapper {
    static toDTO(attribute: Attribute): AttributeDTO {
        const props = attribute.getProps();
        return {
            id: props.id!,
            name: props.name.val(),
            created_at: props.created_at!,
            updated_at: props.updated_at!
        };
    }
}