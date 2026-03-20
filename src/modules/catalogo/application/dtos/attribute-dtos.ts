export interface CreateAttributeDTO {
    name: string;
}

export interface UpdateAttributeDTO {
    name: string;
}

export interface AttributeDTO {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}