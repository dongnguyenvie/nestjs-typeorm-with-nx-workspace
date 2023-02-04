import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GetPaginationOutput, PaginationInput } from '@noinghe/api/core/lib/dtos';
import { UserEntity } from '../entity/user.entity';

@InputType()
export class GetUsersInput {
  @Field()
  pagination: PaginationInput;

  @Field((_) => [String], { nullable: true, defaultValue: [] })
  relations: string[];
}

@ObjectType()
export class GetUsersOutput extends GetPaginationOutput {
  @Field((_) => [UserEntity])
  data: UserEntity[];
}
