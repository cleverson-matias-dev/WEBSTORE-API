import { IAttributeRepository, AttributeFilterOptions } from '@modules/catalog/application/interfaces/repository/IAttributeRepository';
import { Attribute } from '@modules/catalog/domain/entities/attribute.entity';
import { AttributeName } from '@modules/catalog/domain/value-objects/attribute.name.vo';
import { v4 as uuidv4 } from 'uuid';

export class MockAtributoRepository implements IAttributeRepository {
    private items: Attribute[] = [];

    async save(attribute: Attribute): Promise<Attribute> {
        const props = attribute.getProps();
        
        const novoAtributo = new Attribute({
            ...props,
            id: props.id || uuidv4(), 
            created_at: props.created_at || new Date(),
            updated_at: props.updated_at || new Date()
        });

        this.items.push(novoAtributo);
        return novoAtributo;
    }

    async allPaginated(options: AttributeFilterOptions): Promise<[Attribute[], number]> {
        let filtered = this.items;
        if (options.name) {
            filtered = filtered.filter(a => a.getProps().name.val().includes(options.name!));
        }
        const total = filtered.length;
        const paginated = filtered.slice(options.offset, options.offset + options.limit);
        return [paginated, total];
    }

    async all(): Promise<Attribute[]> {
        return this.items;
    }

    async findBy(id: string): Promise<Attribute | null> {
        const item = this.items.find(i => i.getProps().id === id);
        return item ? item : null;
    }

    async update(id: string, name: string): Promise<boolean> {
        const index = this.items.findIndex(i => i.getProps().id === id);
        
        if (index === -1) return false;

        const propsAntigas = this.items[index].getProps();
        
        this.items[index] = new Attribute({
            ...propsAntigas,
            name: AttributeName.create(name),
            updated_at: new Date()
        });

        return true;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.items.findIndex(i => i.getProps().id === id);
        
        if (index === -1) return false;

        this.items.splice(index, 1);
        return true;
    }
}
