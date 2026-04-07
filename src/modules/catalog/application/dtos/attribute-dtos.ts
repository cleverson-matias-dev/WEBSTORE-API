
export interface PaginatedAttributesDTO {
    items: AttributeDTO[];
    total: number;
    page: number;
    limit: number;
}

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

export interface GetAllAttributesInputDTO {
    page?: number,
    limit?: number,
    name?: string
}

export interface PaginatedAttributesDTO {
    items: AttributeDTO[],
    total: number,
    page: number,
    limit: number
}