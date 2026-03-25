import { Category } from "../../modules/catalog/domain/entities/category.entity";
import { CategoryName } from "../../modules/catalog/domain/value-objects/category.name.vo";
import { ICategoryRepository, CategoryFilterOptions } from "../../modules/catalog/application/interfaces/repository/ICategoryRepository";
import { v4 as uuidv4 } from 'uuid';

export class MockCategoryRepository implements ICategoryRepository {
    private items: Category[] = [];

    async save(category: Category): Promise<Category> {
        const props = category.getProps();
        
        const novaCategoria = new Category({
            ...props,
            id: props.id || uuidv4(),
            created_at: props.created_at || new Date(),
            updated_at: new Date()
        });

        this.items.push(novaCategoria);
        return novaCategoria;
    }

    async allPaginated(options: CategoryFilterOptions): Promise<[Category[], number]> {
        let filtered = this.items;
        if (options.name) {
            filtered = filtered.filter(c => c.getProps().name.val().includes(options.name!));
        }
        const total = filtered.length;
        const paginated = filtered.slice(options.offset, options.offset + options.limit);
        return [paginated, total];
    }

    async all(): Promise<Category[]> {
        return [...this.items];
    }

    async findBy(id: string): Promise<Category | null> {
        const item = this.items.find(cat => cat.getProps().id === id);
        return item || null;
    }

    async update(id: string, name: string): Promise<boolean> {
        const index = this.items.findIndex(cat => cat.getProps().id === id);
        
        if (index !== -1) {
            const propsAntigas = this.items[index].getProps();
            
            const categoriaAtualizada = new Category({
                ...propsAntigas,
                name: CategoryName.create(name),
                updated_at: new Date()
            });

            this.items[index] = categoriaAtualizada;
            return true;
        }

        return false;
    }

    async delete(id: string): Promise<boolean> {
        const initialLength = this.items.length;
        this.items = this.items.filter(cat => cat.getProps().id !== id);
        
        return initialLength > this.items.length;
    }
}
