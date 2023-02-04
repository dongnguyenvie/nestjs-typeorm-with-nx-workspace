import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity, UserEntity } from '@noinghe/shared/data-access/entities';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';

@ObjectType()
@Entity({ name: 'blog' })
export class BlogEntity extends CoreEntity<BlogEntity> {
  @Field({})
  @Column('varchar', { name: 'title' })
  title: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.blogs)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @RelationId((blog: BlogEntity) => blog.createdBy)
  createdById: string;

  constructor(partial: Partial<BlogEntity>) {
    super(partial);
    Object.assign(this, partial);
  }

  static fromData(partial: Partial<BlogEntity>) {
    return new BlogEntity(partial);
  }
}
