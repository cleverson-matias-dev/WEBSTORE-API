import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name:'stock_reservations', database: 'webstore_stock'})
export class StockReservationSchema {
  @PrimaryColumn('uuid') id: string;
  @Column({type:'varchar'}) orderId: string;
  @Column({type:'varchar'}) sku: string;
  @Column({type:'varchar'}) warehouseId: string;
  @Column("int") quantity: number;
  @Column({type:'datetime'}) expiresAt: Date;
  @Column('varchar') status: string;
}