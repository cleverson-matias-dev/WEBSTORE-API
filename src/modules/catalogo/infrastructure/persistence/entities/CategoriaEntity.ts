import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm"

@Entity({name: 'categorias'})
export class CategoriaEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'varchar', length: '100' })
    nome: string

    @Column({ type: 'varchar', length: '100' })
    slug: string

    // 1. Defina a coluna física como opcional (nullable)
    @Column({ type: 'uuid', nullable: true })
    parent_id?: string | null

    // 2. Garante que a relação aceite nulo (nullable: true)
    @ManyToOne(() => CategoriaEntity, (categoria) => categoria.children, { 
        onDelete: 'CASCADE', 
        nullable: true 
    })
    @JoinColumn({ name: 'parent_id' })
    parent?: CategoriaEntity | null

    @OneToMany(() => CategoriaEntity, (categoria) => categoria.parent)
    children: CategoriaEntity[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
