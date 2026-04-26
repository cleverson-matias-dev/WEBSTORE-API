import type { AttributeFilterOptions, IAttributeRepository } from "@modules/catalog/application/interfaces/repository/IAttributeRepository";
import { Attribute } from "@modules/catalog/domain/entities/attribute.entity";
import { AttributeName } from "@modules/catalog/domain/value-objects/attribute.name.vo";

// tests/mocks/InMemoryAttributeRepository.ts
export class InMemoryAttributeRepository implements IAttributeRepository {
    private items: Attribute[] = [];

    async save(attribute: Attribute): Promise<Attribute> {
        this.items.push(attribute);
        return attribute;
    }

    async allPaginated(options: AttributeFilterOptions): Promise<[Attribute[], number]> {
        let filtered = this.items;
        if (options.name) {
            filtered = this.items.filter(i => i.name.includes(options.name!));
        }
        const slice = filtered.slice(options.offset, options.offset + options.limit);
        return [slice, filtered.length];
    }

    async findBy(id: string): Promise<Attribute | null> {
        return this.items.find(i => i.id === id) || null;
    }

    async findByName(name: string): Promise<Attribute | null> {
        return this.items.find(i => i.name === name) || null;
    }

    async update(id: string, name: string): Promise<void> {
        const index = this.items.findIndex(i => i.id === id);
        if (index !== -1) {
            const props = this.items[Number(index)];
            this.items[Number(index)] = Attribute.restore(
                props.id, 
                { 
                    createdAt: props.createdAt, 
                    updatedAt: props.updatedAt, 
                    name: new AttributeName(name) 
                }
            );
        }
    }

    async delete(id: string): Promise<boolean> {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) return false;
        this.items.splice(index, 1);
        return true;
    }
}
