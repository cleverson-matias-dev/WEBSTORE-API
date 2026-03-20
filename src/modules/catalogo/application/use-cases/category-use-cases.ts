
import { CategoryName } from "../../domain/value-objects/category.name.vo";
import { ICategoryRepository } from "../repository/ICategoryRepository";
import { Category } from "../../domain/entities/category.entity";
import { CreateCategoryDTO, UpdateCategoryDTO, CategoryDTO } from "../dtos/category-dtos";
import { CategoryMapper } from "../dtos/category-mapper";

export class UpdateCategoryUC {
    constructor(private repo: ICategoryRepository) {}

    async execute(uuid: string, dto: UpdateCategoryDTO): Promise<boolean> {
        const name = new CategoryName(dto.name);
        return this.repo.update(uuid, name.val());
    }
}

export class FindCategoryByIdUC {
    constructor(private repository: ICategoryRepository){}

    async execute(uuid: string): Promise<CategoryDTO | null> {
        const category = await this.repository.findBy(uuid);
        if (category instanceof Category) {
            return CategoryMapper.toDTO(category);
        }
        return null;
    }
}

export class SaveCategoryUC {
    constructor(private repository: ICategoryRepository) {}

    async execute(dto: CreateCategoryDTO): Promise<CategoryDTO> {
        const name = new CategoryName(dto.name);
        const parent_id = dto.parent_id === "" ? null : dto.parent_id;
        const category = new Category({ name, parent_id, slug: dto.slug });
        const saved = await this.repository.save(category);
        return CategoryMapper.toDTO(saved);
    }
}

export class DeleteCategoryUC {
    constructor(private repo: ICategoryRepository) {}

    async execute(uuid: string): Promise<boolean> {
        return this.repo.delete(uuid);
    }
}

export class GetAllCategoriesUC {
    constructor(private repository: ICategoryRepository) {}

    async execute(): Promise<CategoryDTO[]> {
        const categories = await this.repository.all();
        return categories.map(CategoryMapper.toDTO);
    }

}

