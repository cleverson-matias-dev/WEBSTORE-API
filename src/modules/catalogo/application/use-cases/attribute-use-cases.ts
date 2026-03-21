import { AttributeName } from "@modules/catalogo/domain/value-objects/attribute.name.vo";
import { Attribute } from "@modules/catalogo/domain/entities/attribute.entity";
import { CreateAttributeDTO, UpdateAttributeDTO, AttributeDTO, GetAllAttributesInputDTO, PaginatedAttributesDTO } from "../dtos/attribute-dtos";
import { AttributeMapper } from "../dtos/attribute-mapper";
import { IAttributeRepository } from "../repository/IAttributeRepository";

export class UpdateAttributeUC {
    constructor(private repo: IAttributeRepository) {}

    async execute(uuid: string, dto: UpdateAttributeDTO): Promise<boolean> {
        const name = new AttributeName(dto.name);
        return this.repo.update(uuid, name.val());
    }
}

export class FindAttributeUC {
    constructor(private repository: IAttributeRepository){}

    async execute(uuid: string): Promise<AttributeDTO | null> {
        const attribute = await this.repository.findBy(uuid);
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

    async execute(uuid: string): Promise<boolean> {
        return this.repo.delete(uuid);
    }
}

export class GetAllAttributesUC {
    constructor(private repository: IAttributeRepository) {}

    async execute(input: GetAllAttributesInputDTO): Promise<PaginatedAttributesDTO> {

        const page = Number(input.page) || 1;
        const limit = Number(input.limit) || 10;
        const offset = (page - 1) * limit;

        const [attributes, total] = await this.repository.allPaginated({
            offset,
            limit,
            name: input.name
        });

        return {
            items: attributes.map(AttributeMapper.toDTO),
            total,
            page,
            limit
        };
    }
}

