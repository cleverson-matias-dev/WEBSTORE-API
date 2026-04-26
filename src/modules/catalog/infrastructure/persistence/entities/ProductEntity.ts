import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, OneToMany, UpdateDateColumn, ManyToOne, DeleteDateColumn } from "typeorm"
import { CategoryEntity } from "./CategoryEntity"
import { Sku } from "./Sku"
import { ImageEntity } from "./ImageEntity"

@Entity({name: 'produtos', database: 'webstore_catalogo'})
export class Produto {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: 'varchar',
        length: '100',
        unique: true,
    })
    name: string

    @Column({
        type: 'varchar',
        length: '100'
    })
    slug: string

    @Column({
        type: 'text'
    })
    description: string

    @OneToMany(()=>Sku, (sku) => sku.produto)
    skus: Sku[]

    @Column({type:'text', unique: false})
    category_id: string

    @ManyToOne(()=>CategoryEntity, categoria => categoria.products, {onDelete:'RESTRICT'})
    @JoinColumn({name: 'category_id'})
    category: CategoryEntity

    @OneToMany(()=>ImageEntity, (imagem)=> imagem.produto, {cascade: true})
    images: ImageEntity[]

    @Column({ type: 'varchar', length: 100, nullable: true })
    brand: string;

    @Column({ type: 'uuid', nullable: true })
    collection_id: string;

    @Column({
        type: 'enum',
        enum: ['simple', 'variable', 'digital', 'service'],
        default: 'simple'
    })
    product_type: string;

    @Column({
        type: 'enum',
        enum: ['catalog', 'search', 'hidden'],
        default: 'catalog'
    })
    visibility: string;

    @Column({ type: 'timestamp', nullable: true })
    published_at: Date;

    @Column({ type: 'text', nullable: true })
    short_description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    meta_description_title: string;

    @Column({ type: 'boolean', default: false })
    has_variants: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    video_url: string;

    @DeleteDateColumn()
    deleted_at: Date;

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}