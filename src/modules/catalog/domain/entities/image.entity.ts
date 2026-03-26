export interface IImage {
    id?: string;
    produto_id: string; 
    url: string;
    ordem: number;
    created_at?: Date;
    updated_at?: Date;
}

export class Image {
    
    private props: IImage;

    constructor(props: IImage) {
        this.props = {
            ...props,
            created_at: props.created_at ?? new Date(),
            updated_at: props.updated_at ?? new Date()
        };
    }

    getProps(): IImage {
        return this.props;
    }
}
