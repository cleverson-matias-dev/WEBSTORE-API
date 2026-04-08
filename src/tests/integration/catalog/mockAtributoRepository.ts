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
            filtered = this.items.filter(i => i.getProps().name.val().includes(options.name!));
        }
        const slice = filtered.slice(options.offset, options.offset + options.limit);
        return [slice, filtered.length];
    }

    async findBy(id: string): Promise<Attribute | null> {
        return this.items.find(i => i.getProps().id === id) || null;
    }

    async findByName(name: string): Promise<Attribute | null> {
        return this.items.find(i => i.getProps().name.val() === name) || null;
    }

    async update(id: string, name: string): Promise<void> {
        const index = this.items.findIndex(i => i.getProps().id === id);
        if (index !== -1) {
            const props = this.items[Number(index)].getProps();
            this.items[Number(index)] = new Attribute({ ...props, name: new AttributeName(name) });
        }
    }

    async delete(id: string): Promise<boolean> {
        const index = this.items.findIndex(i => i.getProps().id === id);
        if (index === -1) return false;
        this.items.splice(index, 1);
        return true;
    }
}
