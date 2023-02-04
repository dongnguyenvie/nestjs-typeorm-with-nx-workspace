import { GetByIdInput } from '@noinghe/api/core/lib/dtos';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class GetRoleByIdInput extends GetByIdInput {}

@ObjectType()
export class GetRoleByIdOutput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field((_) => Boolean)
  isDefault: boolean;

  @Field((_) => [String])
  scp: string[];
}
