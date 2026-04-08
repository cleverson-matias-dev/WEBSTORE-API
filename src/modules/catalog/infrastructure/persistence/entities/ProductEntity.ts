import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, OneToMany, UpdateDateColumn, ManyToOne } from "typeorm"
import { CategoryEntity } from "./CategoryEntity"
import { Sku } from "./Sku"
import { ImageEntity } from "./ImageEntity"

@Entity({name: 'produtos', database: 'webstore_catalogo'})
export class Produto {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: 'varchar',
        length: '100',
        unique: true,
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
    description: string

    @OneToMany(()=>Sku, (sku) => sku.produto)
    skus: Sku[]

    @Column({type:'text', unique: false})
    category_id: string

    @ManyToOne(()=>CategoryEntity, categoria => categoria.products, {onDelete:'RESTRICT'})
    @JoinColumn({name: 'category_id'})
    category: CategoryEntity

    @OneToMany(()=>ImageEntity, (imagem)=> imagem.produto, {cascade: true})
    images: ImageEntity[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}