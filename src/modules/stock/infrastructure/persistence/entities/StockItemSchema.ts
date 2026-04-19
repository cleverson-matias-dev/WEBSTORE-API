import { Entity, PrimaryColumn, Column, Index } from "typeorm";

@Entity({name:'stock_items', database: 'webstore_stock'})
@Index(["sku", "warehouseId"], { unique: true })
export class StockItemSchema {
  @PrimaryColumn('uuid') id: string;
  @Column('uuid') sku: string;
  @Column('varchar') warehouseId: string;
  @Column("int") quantityOnHand: number;
  @Column("int") quantityReserved: number;
  @Column("int") version: number;
}