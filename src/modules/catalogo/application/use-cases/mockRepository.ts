import { Categoria } from "../../domain/entities/categoria.entity";
import { CategoriaNome } from "../../domain/value-objects/categoria.nome.vo";
import { ICategoryRepository } from "../../application/repository/ICategoryRepository";
import { v4 as uuidv4 } from 'uuid';

export class MockCategoryRepository implements ICategoryRepository {
    private items: Categoria[] = [];

    async save(categoria: Categoria): Promise<Categoria> {
        const props = categoria.getProps();
        
        const novaCategoria = new Categoria({
            ...props,
            id: props.id || uuidv4(),
            created_at: props.created_at || new Date(),
            updated_at: new Date()
        });

        this.items.push(novaCategoria);
        return novaCategoria;
    }

    async findAll(): Promise<Categoria[]> {
        return [...this.items];
    }

    async findById(id: string): Promise<Categoria | null> {
        const item = this.items.find(cat => cat.getProps().id === id);
        return item || null;
    }

    async update(id: string, nome: string): Promise<void> {
        const index = this.items.findIndex(cat => cat.getProps().id === id);
        
        if (index !== -1) {
            const propsAntigas = this.items[index].getProps();
            
            // Criamos uma nova instância para disparar a lógica de slug e validação
            const categoriaAtualizada = new Categoria({
                ...propsAntigas,
                nome: CategoriaNome.create(nome),
                updated_at: new Date()
            });

            this.items[index] = categoriaAtualizada;
        }
    }

    async delete(id: string): Promise<number | null | undefined> {
        const initialLength = this.items.length;
        this.items = this.items.filter(cat => cat.getProps().id !== id);
        
        return initialLength > this.items.length ? 1 : 0;
    }
}
