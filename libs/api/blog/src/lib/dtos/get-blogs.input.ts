import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GetPaginationOutput, PaginationInput } from '@noinghe/api/core/lib/dtos';
import { BlogEntity } from '../entity/blog.entity';

@InputType()
export class GetBlogsInput {
  @Field(() => PaginationInput)
  pagination: PaginationInput;

  @Field((_) => [String], { nullable: true, defaultValue: [] })
  relations: string[];
}

@ObjectType()
export class GetBlogsOutput extends GetPaginationOutput {
  @Field((_) => [BlogEntity])
  data: BlogEntity[];
}
