import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm"
import { CategoryEntity } from "./CategoryEntity"
import { Sku } from "./Sku"
import { ImageEntity } from "./ImageEntity"

@Entity()
export class Produto {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: 'varchar',
        length: '100'
    })
    name: string

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

    @OneToOne(()=>CategoryEntity)
    @JoinColumn()
    categoria_id: CategoryEntity

    @OneToMany(()=>ImageEntity, (imagem)=> imagem.produto)
    imagens: ImageEntity[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}