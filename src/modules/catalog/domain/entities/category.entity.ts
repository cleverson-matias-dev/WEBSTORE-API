import { CategoryName } from "../value-objects/category.name.vo";
import { Slug } from "../value-objects/slug.vo";

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
    }

    getProps(): ICategory {
        return this.props;
    }
}