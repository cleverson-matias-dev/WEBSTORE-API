import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity({name: 'attributes'})
export class AttributeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: 'varchar',
        length: '100'
    })
    name: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}