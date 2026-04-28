import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, ManyToOne, UpdateDateColumn, Unique } from "typeorm"
import { Produto } from "./ProductEntity"

@Entity({ name: 'images', database: 'webstore_catalogo' })
// Define a chave única combinada aqui
@Unique("UQ_PRODUCT_IMAGE_URL", ["product_id", "url"]) 
export class ImageEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: 'uuid',
        nullable: false
    })
    product_id: string

    @ManyToOne(() => Produto, (produto) => produto.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    produto: Produto

    @Column({
        type: 'varchar',
        // Removi o unique: true daqui, pois agora a unicidade é combinada acima
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
