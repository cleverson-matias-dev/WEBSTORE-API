import type { CategoryFilterOptions, ICategoryRepository } from "@modules/catalog/application/interfaces/repository/ICategoryRepository";
import { Category } from "@modules/catalog/domain/entities/category.entity";
import { CategoryName } from "@modules/catalog/domain/value-objects/category.name.vo";
import { Slug } from "@modules/catalog/domain/value-objects/slug.vo";

export class InMemoryCategoryRepository implements ICategoryRepository {
    private items: Category[] = [];

    async save(category: Category): Promise<Category> {
        this.items.push(category);
        return category;
    }

    async allPaginated(options: CategoryFilterOptions): Promise<[Category[], number]> {
        let filtered = this.items;

        if (options.name) {
            filtered = filtered.filter(cat => 
                cat.getProps().name.val().toLowerCase().includes(options.name!.toLowerCase())
            );
        }

        const total = filtered.length;
        const start = options.offset;
        const end = start + options.limit;
        
        const paginatedItems = filtered.slice(start, end);

        return [paginatedItems, total];
    }

    async findBy(id: string): Promise<Category | null> {
        const category = this.items.find(cat => cat.id === id);
        return category || null;
    }

    async update(id: string, name: string): Promise<boolean> {
        const index = this.items.findIndex(cat => cat.id === id);
        
        if (index === -1) return false;

        const currentProps = this.items[Number(index)].getProps();
        
        // Cria uma nova instância para refletir a mudança de nome e slug
        const updatedCategory = new Category({
            ...currentProps,
            name: new CategoryName(name),
            slug: Slug.create(name).getValue,
            updated_at: new Date()
        });

        this.items[Number(index)] = updatedCategory;
        return true;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.items.findIndex(cat => cat.id === id);
        
        if (index === -1) return false;

        this.items.splice(index, 1);
        return true;
    }
}
