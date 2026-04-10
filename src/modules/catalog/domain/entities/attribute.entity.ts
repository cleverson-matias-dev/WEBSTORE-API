import { AttributeName } from "../value-objects/attribute.name.vo";

export interface IAttribute {
    id?:string, 
    name: AttributeName,
    created_at?: Date, 
    updated_at?: Date
}

export class Attribute {
    
    private props: IAttribute;

    constructor(props: IAttribute) {
        this.props = props;
    }

    getProps(): IAttribute {
        return this.props;
    }
    
}