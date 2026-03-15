import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Categoria {
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

    @Column('varchar')
    parent_id?: string | undefined

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}