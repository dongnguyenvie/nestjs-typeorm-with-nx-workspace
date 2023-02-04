import { RecordAction } from '@noinghe/shared/utils/lib/enums';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { RoomOutput } from './base.dto';

@ObjectType()
export class OnRoomSyncedOutPut {
  constructor(payload: Partial<OnRoomSyncedOutPut>) {
    Object.assign(this, payload);
  }

  @Field(() => Float)
  action: RecordAction;

  @Field(() => RoomOutput)
  room: RoomOutput;
}
