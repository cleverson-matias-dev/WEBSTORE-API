import { AttributeName } from "../value-objects/attribute.name.vo";
import { v4 as uuidv4 } from 'uuid'; // Exemplo de biblioteca para IDs

export interface AttributeProps {
    name: AttributeName;
    createdAt: Date;
    updatedAt: Date;
}

export class Attribute {
    private readonly _id: string;
    private props: AttributeProps;

    // 1. Construtor privado para forçar o uso de métodos de fábrica
    private constructor(props: AttributeProps, id?: string) {
        this._id = id ?? uuidv4();
        this.props = props;
    }

    // 2. Factory Method (Método de Fábrica) para criação controlada
    static create(name: string): Attribute {
        const attributeName = new AttributeName(name); // O VO já deve validar o nome
        
        const now = new Date();
        return new Attribute({
            name: attributeName,
            createdAt: now,
            updatedAt: now
        });
    }

    // 3. Método para reconstrução (útil para persistência/banco de dados)
    static restore(id: string, props: AttributeProps): Attribute {
        return new Attribute(props, id);
    }

    // 4. Encapsulamento: Getters sem expor o objeto de props interno
    get id(): string {
        return this._id;
    }

    get name(): string {
        return this.props.name.val();
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    // 5. Comportamento: Alteração de estado com regras de negócio
    public changeName(newName: string): void {
        this.props.name = new AttributeName(newName);
        this.touch();
    }

    // Método privado para atualizar o timestamp de alteração
    private touch(): void {
        this.props.updatedAt = new Date();
    }

    // 6. Imutabilidade defensiva: Retorna uma cópia para evitar efeitos colaterais
    toJSON() {
        return {
            id: this.id,
            ...this.props,
            name: this.name
        };
    }
}
