import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'public' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  id: string;

  @Column('character varying', { name: 'email', length: 255 })
  email: string;

  @Column('character varying', { name: 'name', length: 255, nullable: true })
  name: string;

  @Column('character varying', { name: 'password', length: 255 })
  password: string;
}
