import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Sku } from "./Sku"
import { Atributo } from "./Atributo"

@Entity('sku_atributo_valor')
export class SkuAtributoValor {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type:'uuid'
    })
    sku_id: string

    @Column({
        type: 'uuid'
    })
    atributo_id: string

    @Column({
        type: 'varchar',
        length: '100'
    })
    valor: string

    @ManyToOne(()=>Sku, (sku)=>sku.atributos)
    @JoinColumn({name: 'sku_id'})
    sku: Sku

    @ManyToOne(()=>Atributo)
    @JoinColumn({name: 'atributo_id'})
    atributo: Atributo

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}