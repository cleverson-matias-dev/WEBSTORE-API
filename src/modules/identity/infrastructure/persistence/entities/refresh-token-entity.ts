import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'refresh_tokens', database: 'webstore_users' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  token: string;

  @Column('varchar')
  userId: string;

  @Column('datetime')
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
