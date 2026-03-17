import { CategoriaNome } from "../value-objects/categoria.nome.vo";

export interface ICategoria {
    id?:string, 
    nome: CategoriaNome, 
    slug?: string, 
    parent_id?: string | null, 
    created_at?: Date, 
    updated_at?: Date
}

export class Categoria {
    
    private props: ICategoria;

    constructor(props: ICategoria) {
        this.props = props;
        this.props.slug = this.props.slug ||this.generateSlug(this.props.nome);
    }

    private generateSlug(nome: CategoriaNome): string {
        return nome.val()
            .normalize('NFD')                
            .replace(/[\u0300-\u036f]/g, '') 
            .toLowerCase()                   
            .trim()                          
            .replace(/[^a-z0-9\s-]/g, '')    
            .replace(/\s+/g, '-')            
            .replace(/-+/g, '-');            
    }

    getProps(): ICategoria {
        return this.props;
    }
}