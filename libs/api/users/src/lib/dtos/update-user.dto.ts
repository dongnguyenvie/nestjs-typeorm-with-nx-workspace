import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UpdateByIdInput, UpdateOutput } from '@noinghe/api/core/lib/dtos';

@InputType()
export class UpdateUserInput extends UpdateByIdInput {
  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  mobile: string;

  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  profile: string;
}

@ObjectType()
export class UpdateUserOutput extends UpdateOutput {}
