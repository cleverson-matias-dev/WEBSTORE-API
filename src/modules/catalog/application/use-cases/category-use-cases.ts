
import { CategoryName } from "../../domain/value-objects/category.name.vo";
import { ICategoryRepository } from "../interfaces/repository/ICategoryRepository";
import { Category } from "../../domain/entities/category.entity";
import { CreateCategoryDTO, UpdateCategoryDTO, CategoryDTO, GetAllCategoriesInputDTO, PaginatedCategoriesDTO } from "../dtos/category-dtos";
import { CategoryMapper } from "../dtos/category-mapper";
import { AppError } from "@shared/errors/AppError";
import { IProductRepository } from "../interfaces/repository/IProductRepository";
import { Product } from "@modules/catalog/domain/entities/product.entity";

export class UpdateCategoryUC {
    constructor(private repo: ICategoryRepository) {}

    async execute(uuid: string, dto: UpdateCategoryDTO): Promise<boolean> {
        const name = new CategoryName(dto.name);
        return this.repo.update(uuid, name.val());
    }
}

export class FindCategoryByIdUC {
    constructor(private repository: ICategoryRepository){}

    async execute(uuid: string): Promise<CategoryDTO> {
    
            const category = await this.repository.findBy(uuid);
            if (!(category instanceof Category)) throw new AppError('categoria não encontrada', 404);
            return CategoryMapper.toDTO(category);
    }
}

export class SaveCategoryUC {
    constructor(private repository: ICategoryRepository) {}

    async execute(dto: CreateCategoryDTO): Promise<CategoryDTO> {
        const name = new CategoryName(dto.name);
        const parent_id = dto.parent_id === "" ? null : dto.parent_id;
        const category = new Category({ name, parent_id, slug: dto.slug });
        try {
            const saved = await this.repository.save(category);
            return CategoryMapper.toDTO(saved);
        } catch (error) {
            console.log(error)
            throw new AppError('Erro ao salvar categoria')
        }
        
    }
}

export class DeleteCategoryUC {
    constructor(private repo: ICategoryRepository, private prod_repo: IProductRepository) {}

    async execute(uuid: string): Promise<boolean> {
        const prods_with_category = await this.prod_repo.findBy({category_id: uuid});
        if(prods_with_category instanceof Product) throw new AppError('existem produtos vinculados a essa categoria', 409);
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

