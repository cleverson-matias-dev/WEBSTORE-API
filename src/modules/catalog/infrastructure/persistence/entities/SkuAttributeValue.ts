import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm"
import { Sku } from "./Sku"
import { AttributeEntity } from "./AttributeEntity"

@Entity('sku_atributo_valor')
@Unique(['sku_id', 'attribute_id'])
export class SkuAttributeValue {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type:'uuid'
    })
    sku_id: string

    @Column({
        type: 'uuid'
    })
    attribute_id: string

    @Column({
        type: 'varchar',
        length: '100'
    })
    value: string

    @ManyToOne(()=>Sku, (sku)=>sku.attributes)
    @JoinColumn({name: 'sku_id'})
    sku: Sku

    @ManyToOne(()=>AttributeEntity)
    @JoinColumn({name: 'attribute_id'})
    attribute: AttributeEntity

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}