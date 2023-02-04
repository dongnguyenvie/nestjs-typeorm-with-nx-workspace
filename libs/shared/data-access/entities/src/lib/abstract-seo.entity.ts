import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Column } from 'typeorm';
import { CoreEntity } from './core.entity';

@ObjectType()
export abstract class AbstractSeoEntity extends CoreEntity {
  @Field((_) => GraphQLJSON, { nullable: true })
  @Column({ type: 'json', nullable: true, name: 'meta' })
  meta: any;

  @Field({})
  @Column('varchar', { unique: true })
  slug: string;

  @Field((_) => GraphQLJSON, { name: 'last_update_by', nullable: true })
  lastUpdateBy: any;
}
