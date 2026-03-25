import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity({name: 'attributes', database: 'webstore_catalogo'})
export class AttributeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: 'varchar',
        length: '100',
        unique: true
    })
    name: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}