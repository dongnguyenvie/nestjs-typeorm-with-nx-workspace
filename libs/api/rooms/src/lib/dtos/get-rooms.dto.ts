import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { GetPaginationOutput, PaginationInput } from '@noinghe/api/core/lib/dtos';
import { RoomOutput } from './base.dto';

@InputType()
export class GetRoomsIntput {
  @Field()
  pagination: PaginationInput;

  @Field((_) => [String], { nullable: true, defaultValue: [] })
  relations: string[];
}

@ObjectType()
export class GetRoomsOutput extends GetPaginationOutput {
  @Field((_) => [RoomOutput])
  data: RoomOutput[];
}
