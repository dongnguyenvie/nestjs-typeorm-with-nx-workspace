import { ICurrentUser } from '@noinghe/shared/utils/lib/interfaces';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReqUser implements ICurrentUser {
  @Field({})
  username: string;

  @Field({})
  email: string;

  @Field({})
  sub: string;

  @Field({})
  id: string;

  @Field((_) => [String], {})
  scp: string[];

  @Field({})
  avatar: string;

  @Field({})
  name: string;
}

@ObjectType()
export class IdRelationship {
  @Field()
  public id!: string;
}

@ObjectType()
export class Pagination {
  @Field({ defaultValue: -1 })
  limit: number;

  @Field({ defaultValue: 0 })
  page: number;

  @Field({ defaultValue: -1 })
  totalCount: number;
}

@ObjectType()
export class DeleteOutput {
  @Field()
  id: string;
}

@ObjectType()
export class UpdateOutput {
  @Field()
  id: string;
}

@ObjectType()
export class RecoverOutput {
  @Field()
  id: string;
}

@ObjectType()
export class CreateOutput {
  @Field()
  id: string;
}

@ObjectType()
export class GetPaginationOutput {
  @Field((_) => Pagination)
  pagination: Pagination;
}

@ObjectType()
export class DefaultOutput {
  @Field()
  id: string;

  @Field({})
  public createdAt: Date;

  @Field({})
  public updatedAt: Date;
}
