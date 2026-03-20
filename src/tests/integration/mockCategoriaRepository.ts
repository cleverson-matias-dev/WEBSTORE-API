import { Category } from "../../modules/catalogo/domain/entities/category.entity";
import { CategoryName } from "../../modules/catalogo/domain/value-objects/category.name.vo";
import { ICategoryRepository } from "../../modules/catalogo/application/repository/ICategoryRepository";
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

    async all(): Promise<Category[]> {
        return [...this.items];
    }

    async findBy(id: string): Promise<Category | []> {
        const item = this.items.find(cat => cat.getProps().id === id);
        return item || [];
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
