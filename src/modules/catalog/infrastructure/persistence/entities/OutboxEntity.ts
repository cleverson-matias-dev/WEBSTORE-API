import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'integration_outbox', database: 'webstore_catalogo' })
export class OutboxEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  exchange: string;

  @Column('varchar')
  routing_key: string;

  @Column('text')
  payload: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  processed_at: Date | null;

  @Column({ type:'boolean', default: false })
  published: boolean;
}
