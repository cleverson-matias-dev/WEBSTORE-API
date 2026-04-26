import { AttributeName } from "@modules/catalog/domain/value-objects/attribute.name.vo";
import { Attribute } from "@modules/catalog/domain/entities/attribute.entity";
import { CreateAttributeDTO, UpdateAttributeDTO, AttributeDTO, GetAllAttributesInputDTO, PaginatedAttributesDTO } from "../dtos/attribute-dtos";
import { AttributeMapper } from "../dtos/attribute-mapper";
import { IAttributeRepository } from "../interfaces/repository/IAttributeRepository";
import { AppError } from "@shared/errors/AppError";

export class UpdateAttributeUC {
    constructor(private repo: IAttributeRepository) {}

    async execute(uuid: string, dto: UpdateAttributeDTO): Promise<void> {

        const exists = await this.repo.findBy(uuid);
        if(!(exists instanceof Attribute)) throw new AppError('Atributo não encontrado', 404);

        try {
            const name = new AttributeName(dto.name);
            await this.repo.update(uuid, name.val());
        } catch (error) {
            console.log(error)
            throw new AppError('Erro a processar requisição');
        }
        
    }
}

export class FindAttributeUC {
    constructor(private repository: IAttributeRepository){}

    async execute(uuid: string): Promise<AttributeDTO> {
                
        try {
            const attribute = await this.repository.findBy(uuid);
            if (!(attribute instanceof Attribute)) {
                throw new AppError('recurso não encontrado', 404);
            }
            return AttributeMapper.toDTO(attribute);

        } catch (error) {
            console.log(error)
            throw new AppError('Erro na requisição', 400);
        }
        


    }
}

export class saveAttributeUC {
    constructor(private repository: IAttributeRepository) {}

    async execute(dto: CreateAttributeDTO): Promise<AttributeDTO> {
        const exists = await this.repository.findByName(dto.name);
        if(exists) throw new AppError('Attributo já existe', 409);

        const attribute = Attribute.create(dto.name);
        try {
            const saved = await this.repository.save(attribute);
            return AttributeMapper.toDTO(saved);
        } catch (error) {
            console.log(error)
            throw new AppError('Erro ao salvar atributo', 400);
        }
       
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

