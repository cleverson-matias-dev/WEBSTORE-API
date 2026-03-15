import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm"
import { CategoriaEntity } from "./CategoriaEntity"
import { Sku } from "./Sku"
import { Imagem } from "./Imagem"

@Entity()
export class Produto {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: 'varchar',
        length: '100'
    })
    nome: string

    @Column({
        type: 'varchar',
        length: '100'
    })
    slug: string

    @Column({
        type: 'text'
    })
    descricao: string

    @OneToMany(()=>Sku, (sku) => sku.produto)
    skus: Sku[]

    @OneToOne(()=>CategoriaEntity)
    @JoinColumn()
    categoria_id: CategoriaEntity

    @OneToMany(()=>Imagem, (imagem)=> imagem.produto)
    imagens: Imagem[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}