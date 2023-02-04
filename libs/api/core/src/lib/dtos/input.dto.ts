import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RelationshipInput {
  @Field()
  public id!: string;
}

@InputType()
export class PaginationInput {
  @Field()
  limit: number = 100;

  @Field()
  page: number = 1;

  @Field({ nullable: true })
  totalCount: number = null;
}

@InputType()
export class DeleteByIdInput {
  @Field()
  id: string;
}

@InputType()
export class GetByIdInput {
  @Field()
  id: string;

  @Field((_) => [String], { nullable: true, defaultValue: [] })
  relations: string[] = [];
}

@InputType()
export class GetBySlugInput {
  @Field()
  slug: string;

  @Field((_) => [String], { nullable: true, defaultValue: [] })
  relations: string[];
}

@InputType()
export class SearchInput {
  @Field()
  search: string;

  @Field((_) => [String], { nullable: true, defaultValue: [] })
  relations: string[];
}

@InputType()
export class UpdateByIdInput {
  @Field()
  id: string;
}

@InputType()
export class RecoverByIdInput {
  @Field()
  id: string;
}

@InputType()
export class SubscriptionInput {
  @Field({ nullable: true })
  token: string;
}
