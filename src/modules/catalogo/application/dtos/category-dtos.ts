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

export interface GetAllCategoriesInputDTO {
    name?: string,
    limit?: number,
    page?: number
}

export interface PaginatedCategoriesDTO {
    items: CategoryDTO[],
    total: number,
    page: number,
    limit: number
}