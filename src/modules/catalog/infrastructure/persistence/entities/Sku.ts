import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm"
import { Produto } from "./ProductEntity"
import { SkuAtributoValor } from "./SkuAtributoValor"

@Entity()
export class Sku {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(()=>Produto, (produto)=> produto.skus)
    produto: Produto

    @Column({
        type: 'varchar',
        length: '50',
        unique: true
    })
    codigo_sku: string

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    preco: number

    @Column({
        type: 'int'
    })
    estoque: number

    @Column({
        type: 'decimal',
        precision: 8,
        scale: 2
    })
    peso: number

    @Column({
        type: 'varchar',
        length: 50
    })
    dimensoes: string

    @OneToMany(()=>SkuAtributoValor, (skuAtributoValor) => skuAtributoValor.sku)
    attributes: SkuAtributoValor[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
    
}