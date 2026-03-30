import { CategoryName } from "../value-objects/category.name.vo";
import { Slug } from "../value-objects/slug.vo";
import { v4 as uuidv4 } from 'uuid';

export interface ICategory {
    id?:string, 
    name: CategoryName, 
    slug?: string, 
    parent_id?: string | null, 
    created_at?: Date, 
    updated_at?: Date
}

export class Category {
    
    private props: ICategory;

    constructor(props: ICategory) {
        this.props = props;
        this.props.slug = this.props.slug || Slug.create(this.props.name.val()).getValue;
        this.props.id = props.id || uuidv4();
    }

    get id(): string {
        return this.props.id!;
    }

    getProps(): ICategory {
        return this.props;
    }
}