export interface CreateCategoryDTO {
    name: string;
    parent_id?: string | null;
    slug?: string;
}

export interface UpdateCategoryDTO {
    name: string;
}

export interface CategoryDTO {
    id: string;
    name: string;
    slug: string;
    parent_id?: string | null;
    created_at: Date;
    updated_at: Date;
}