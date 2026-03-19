export interface CreateCategoriaDTO {
    nome: string;
    parent_id?: string | null;
    slug?: string;
}

export interface UpdateCategoriaDTO {
    nome: string;
}

export interface CategoriaDTO {
    id: string;
    nome: string;
    slug: string;
    parent_id?: string | null;
    created_at: Date;
    updated_at: Date;
}