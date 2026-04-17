import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'stock_warehouses', database: 'webstore_stock'})
export class StockWarehouseSchema {
  @PrimaryColumn('uuid') id: string;
  @Column({ unique: true, type: 'varchar' }) code: string;
  @Column('varchar') name: string;
  @Column('tinyint') isActive: boolean;
}