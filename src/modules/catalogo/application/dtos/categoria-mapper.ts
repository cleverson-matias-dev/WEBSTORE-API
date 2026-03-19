import { Categoria } from "../../domain/entities/categoria.entity";
import { CategoriaDTO } from "./categoria-dtos";

export class CategoriaMapper {
    static toDTO(categoria: Categoria): CategoriaDTO {
        const props = categoria.getProps();
        return {
            id: props.id!,
            nome: props.nome.val(),
            slug: props.slug!,
            parent_id: props.parent_id,
            created_at: props.created_at!,
            updated_at: props.updated_at!
        };
    }
}