
import { CategoryName } from "../../domain/value-objects/category.name.vo";
import { ICategoryRepository } from "../repository/ICategoryRepository";
import { Category } from "../../domain/entities/category.entity";
import { CreateCategoryDTO, UpdateCategoryDTO, CategoryDTO, GetAllCategoriesInputDTO, PaginatedCategoriesDTO } from "../dtos/category-dtos";
import { CategoryMapper } from "../dtos/category-mapper";
import { input } from "zod";

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

    async execute(input: GetAllCategoriesInputDTO): Promise<PaginatedCategoriesDTO> {

        const page =  input.page || 1;
        const limit = input.limit || 10;
        const offset = (page - 1) * limit;

        const [categories, total] = await this.repository.allPaginated({
            name: input.name,
            limit,
            offset
        })

        return {
            items: categories.map(CategoryMapper.toDTO),
            total,
            page,
            limit
        }

    }

}

