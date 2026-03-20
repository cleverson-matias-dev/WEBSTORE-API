import { AttributeName } from "@modules/catalogo/domain/value-objects/attribute.name.vo";
import { Attribute } from "@modules/catalogo/domain/entities/attribute.entity";
import { CreateAttributeDTO, UpdateAttributeDTO, AttributeDTO } from "../dtos/attribute-dtos";
import { AttributeMapper } from "../dtos/attribute-mapper";
import { IAttributeRepository } from "../repository/IAttributeRepository";

export class UpdateAttributeUC {
    constructor(private repo: IAttributeRepository) {}

    async execute(id: string, dto: UpdateAttributeDTO): Promise<void> {
        const name = new AttributeName(dto.name);
        await this.repo.update(id, name.val());
    }
}

export class FindAttributeUC {
    constructor(private repository: IAttributeRepository){}

    async execute(id: string): Promise<AttributeDTO | null> {
        const attribute = await this.repository.findBy(id);
        if (attribute instanceof Attribute) {
            return AttributeMapper.toDTO(attribute);
        }
        return null;
    }
}

export class saveAttributeUC {
    constructor(private repository: IAttributeRepository) {}

    async execute(dto: CreateAttributeDTO): Promise<AttributeDTO> {
        const name = new AttributeName(dto.name);
        const attribute = new Attribute({ name: name });
        const saved = await this.repository.save(attribute);
        return AttributeMapper.toDTO(saved);
    }
}

export class DeleteAttributeUC {
    constructor(private repo: IAttributeRepository) {}

    async execute(id: string): Promise<boolean> {
        return this.repo.delete(id);
    }
}

export class GetAllAttributesUC {
    constructor(private repository: IAttributeRepository) {}

    async execute(): Promise<AttributeDTO[]> {
        const attributes = await this.repository.all();
        return attributes.map(AttributeMapper.toDTO);
    }

}

