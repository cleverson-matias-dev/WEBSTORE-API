import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm"
import { Produto } from "./ProductEntity"


@Entity({name: 'images', database: 'webstore_catalogo'})
export class ImageEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: 'uuid'
    })
    produto_id: string

    @ManyToOne(()=>Produto, (produto) => produto.imagens)
    produto: Produto

    @Column({
        type: 'varchar'
    })
    url: string

    @Column({
        type: 'int'
    })
    ordem: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
    
}