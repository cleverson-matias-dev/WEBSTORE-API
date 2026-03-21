import { Category } from "@modules/catalogo/domain/entities/category.entity";

export interface CategoryFilterOptions {
    name?: string,
    limit: number,
    offset: number
}

export interface ICategoryRepository {
    save(category: Category): Promise<Category>
    allPaginated(options: CategoryFilterOptions): Promise<[Category[], number]>
    findBy(id: string): Promise<Category | []>
    update(id: string, name: string): Promise<boolean>
    delete(id: string): Promise<boolean>
}