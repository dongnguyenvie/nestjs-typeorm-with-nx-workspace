import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { DeleteByIdInput } from '@noinghe/api/core/lib/dtos';

@InputType()
export class DeleteRoleIntput extends DeleteByIdInput {}

@ObjectType()
export class DeleteRoleOutput {
  @Field()
  id: string;
}
