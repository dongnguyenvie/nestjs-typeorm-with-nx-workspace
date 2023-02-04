import { Entity, Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from '@noinghe/shared/data-access/entities';

@ObjectType()
@Entity({ name: 'roles' })
export class RoleEntity extends CoreEntity<RoleEntity> {
  @Field({})
  @Column('varchar', {})
  title: string;

  @Field((_) => [String], { nullable: true })
  @Column('simple-array', {
    // nullable: true,
    // array: true,
    // default: [],
    name: 'scp',
  })
  scp: string[];

  @Field((_) => Boolean, { nullable: true })
  @Column('boolean', { nullable: true, default: false, name: 'is_default' })
  isDefault: boolean;

  // constructor(partial: Partial<RoleEntity>) {
  //   super();
  //   Object.assign(this, partial);
  // }

  // static fromData(partial: Partial<RoleEntity>) {
  //   return new RoleEntity(partial);
  // }
}
