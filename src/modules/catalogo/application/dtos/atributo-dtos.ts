export interface CreateAtributoDTO {
    nome: string;
}

export interface UpdateAtributoDTO {
    nome: string;
}

export interface AtributoDTO {
    id: string;
    nome: string;
    created_at: Date;
    updated_at: Date;
}