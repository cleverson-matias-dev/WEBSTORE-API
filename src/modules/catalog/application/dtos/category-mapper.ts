import { Category } from "../../domain/entities/category.entity";
import { CategoryDTO } from "./category-dtos";

export class CategoryMapper {
    static toDTO(category: Category): CategoryDTO {
        const props = category.getProps();
        return {
            id: props.id!,
            name: props.name.val(),
            slug: props.slug!,
            parent_id: props.parent_id,
            created_at: props.created_at!,
            updated_at: props.updated_at!
        };
    }
}