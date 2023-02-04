import { Field, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity<T = unknown> {
  @Field({ nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @Field({ nullable: true })
  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
  })
  deletedAt?: Date;

  @Exclude()
  @Field({ nullable: true })
  @Column({ nullable: true, name: 'deleted_by' })
  deletedBy?: string;

  @Column({ nullable: true, name: 'created_by' })
  createdById?: string;

  @Exclude()
  @Field({ nullable: true })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  public createdAt: Date;

  @Exclude()
  @Field({ nullable: true })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  public updatedAt: Date;

  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}
