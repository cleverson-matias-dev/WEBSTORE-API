import { Atributo } from "../../domain/entities/atributo.entity";
import { AtributoDTO } from "./atributo-dtos";

export class AtributoMapper {
    static toDTO(atributo: Atributo): AtributoDTO {
        const props = atributo.getProps();
        return {
            id: props.id!,
            nome: props.nome.val(),
            created_at: props.created_at!,
            updated_at: props.updated_at!
        };
    }
}