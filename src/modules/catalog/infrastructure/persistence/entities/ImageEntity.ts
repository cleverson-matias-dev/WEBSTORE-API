import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, ManyToOne, UpdateDateColumn } from "typeorm"
import { Produto } from "./ProductEntity"


@Entity({name: 'images', database: 'webstore_catalogo'})
export class ImageEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: 'uuid',
        nullable: false
    })
    product_id: string

    @ManyToOne(()=>Produto, (produto) => produto.images, {onDelete: 'CASCADE'})
    @JoinColumn({name:'product_id'})
    produto: Produto

    @Column({
        type: 'varchar',
        unique: true
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