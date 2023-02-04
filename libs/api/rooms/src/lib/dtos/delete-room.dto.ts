import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { DeleteByIdInput } from '@noinghe/api/core/lib/dtos';

@InputType()
export class DeleteRoomIntput extends DeleteByIdInput {}

@ObjectType()
export class DeleteRoomOutput {
  @Field()
  id: string;
}
