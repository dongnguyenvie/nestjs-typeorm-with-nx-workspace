import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RoomUserOutPut {
  @Field()
  id: string;

  @Field()
  avatar: string;

  @Field()
  name: string;
}

@ObjectType()
export class RoomOutput {
  @Field()
  id: string;

  @Field(() => Float)
  capacity: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  topic?: string;

  @Field({})
  language!: string;

  @Field(() => RoomUserOutPut)
  creator: RoomUserOutPut;

  @Field(() => [RoomUserOutPut])
  clients: string[];

  @Field(() => Float)
  createdAt!: string;

  @Field(() => Float, { defaultValue: 0, nullable: true })
  updatedAt!: string;
}
