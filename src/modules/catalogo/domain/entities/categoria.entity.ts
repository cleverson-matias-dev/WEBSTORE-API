import { CategoriaNome } from "../value-objects/categoria.nome.vo";

export interface CategoriaDomainProps {
    id?:string, 
    nome: CategoriaNome, 
    slug?: string, 
    parent_id?: string, 
    created_at?: Date, 
    updated_at?: Date
}

export class CategoriaDomain {
    
    private props: CategoriaDomainProps;

    constructor(props: CategoriaDomainProps) {
        this.props = props;
        this.props.slug = this.props.slug ||this.generateSlug();
    }

    private generateSlug(): string {
         return this.props.nome.getVal()
        .toString()
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    getProps(): CategoriaDomainProps {
        return this.props;
    }
}