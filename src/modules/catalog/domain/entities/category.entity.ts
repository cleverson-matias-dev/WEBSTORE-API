import { CategoryName } from "../value-objects/category.name.vo";

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
        this.props.slug = this.props.slug || this.generateSlug(this.props.name);
    }

    private generateSlug(name: CategoryName): string {
        return name.val()
            .normalize('NFD')                
            .replace(/[\u0300-\u036f]/g, '') 
            .toLowerCase()                   
            .trim()                          
            .replace(/[^a-z0-9\s-]/g, '')    
            .replace(/\s+/g, '-')            
            .replace(/-+/g, '-');            
    }

    getProps(): ICategory {
        return this.props;
    }
}