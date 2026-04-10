import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Column, Entity } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}

@Entity({name: 'users', database: 'webstore_users'})
export class User extends BaseEntity {
  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({type: 'varchar' })
  password: string;

  @Column({ type: 'varchar'})
  firstName: string;

  @Column({ type: 'varchar'})
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: string;

  @Column({ default: true, type: 'int' })
  isActive: string;
}
