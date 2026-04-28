import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm"
import { Produto } from "./ProductEntity"
import { SkuAttributeValue } from "./SkuAttributeValue"

@Entity({database: 'webstore_catalogo', name: 'skus'})
export class Sku {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Produto, (produto) => produto.skus)
  @JoinColumn({ name: 'product_id' }) 
  produto: Produto;

  @Column({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'varchar', length: 50, unique: true }) 
  codigo_sku: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column({ type: 'varchar', length: 3, default: 'BRL' })
  currency: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  peso: number;

  @Column({ type: 'varchar', length: 50 })
  dimensoes: string;

  @OneToMany(() => SkuAttributeValue, (skuAtributoValor) => skuAtributoValor.sku, { cascade: true })
  attributes: SkuAttributeValue[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
