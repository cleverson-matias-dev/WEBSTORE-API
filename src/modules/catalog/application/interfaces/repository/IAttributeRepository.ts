import { Attribute } from "@modules/catalog/domain/entities/attribute.entity"

export interface AttributeFilterOptions {
    limit: number;
    offset: number;
    name?: string;
}

export interface IAttributeRepository {
    save(attribute: Attribute): Promise<Attribute>
    allPaginated(options: AttributeFilterOptions): Promise<[Attribute[], number]>
    findBy(id: string): Promise<Attribute | null>
    findByName(name: string): Promise<Attribute | null>
    update(id: string, name: string): Promise<void>
    delete(id: string): Promise<boolean>
}