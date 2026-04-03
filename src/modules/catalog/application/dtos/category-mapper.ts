import type { CategoryEntity } from "@modules/catalog/infrastructure/persistence/entities/CategoryEntity";
import { Category } from "../../domain/entities/category.entity";
import { CategoryDTO } from "./category-dtos";
import { CategoryName } from "@modules/catalog/domain/value-objects/category.name.vo";

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

    static toDomain(raw: CategoryEntity): Category {

        return new Category({
            id: raw.id,
            name: new CategoryName(raw.name),
            slug: raw.slug,
            parent_id: raw.parent_id,
            created_at: raw.created_at,
            updated_at: raw.updated_at
        });
    }
}