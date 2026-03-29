import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm"

@Entity({name: 'categories', database: 'webstore_catalogo'})
export class CategoryEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'varchar', length: '100', unique: true })
    name: string

    @Column({ type: 'varchar', length: '100' })
    slug: string

    // 1. Defina a coluna física como opcional (nullable)
    @Column({ type: 'uuid', nullable: true })
    parent_id?: string | null

    // 2. Garante que a relação aceite nulo (nullable: true)
    @ManyToOne(() => CategoryEntity, (category) => category.children, { 
        onDelete: 'CASCADE', 
        nullable: true 
    })
    
    @JoinColumn({ name: 'parent_id' })
    parent?: CategoryEntity | null

    @OneToMany(() => CategoryEntity, (category) => category.parent)
    children: CategoryEntity[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
