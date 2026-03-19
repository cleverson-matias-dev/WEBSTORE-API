import { AtributoNome } from "../value-objects/atributo.nome.vo";

export interface IAtributo {
    id?:string, 
    nome: AtributoNome,
    created_at?: Date, 
    updated_at?: Date
}

export class Atributo {
    
    private props: IAtributo;

    constructor(props: IAtributo) {
        this.props = props;
    }

    getProps(): IAtributo {
        return this.props;
    }
}