import { Category } from "@modules/catalogo/domain/entities/category.entity";

export interface ICategoryRepository {
    save(category: Category): Promise<Category>
    all(): Promise<Category[]>
    findBy(id: string): Promise<Category | []>
    update(id: string, name: string): Promise<boolean>
    delete(id: string): Promise<boolean>
}