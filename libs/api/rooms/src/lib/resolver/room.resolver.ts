import { GraphqlSub } from '@noinghe/shared/utils/lib/constants';
import { GraphqlDescription } from '@noinghe/shared/utils/lib/helpers/description.helper';
import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { ReqUser } from '@noinghe/api/core/lib/dtos';
import { PoliciesGuard } from '@noinghe/api/core/lib/guards/policies.guard';
import { PubSubService } from '@noinghe/api/core/lib/packages/pubsub/pubsub.service';
import { CurrentUser } from '@noinghe/api/core/lib/request';
import { GetRoomsIntput, GetRoomsOutput, CreateRoomInput, CreateRoomOutput } from '../dtos';
import { RoomService } from '../service/room.service';
import { OnRoomSyncedOutPut } from '../dtos/on-room-synced.dto';
import { DeleteRoomIntput, DeleteRoomOutput } from '../dtos/delete-room.dto';

const API_GROUP = 'room';

@Resolver()
export class RoomResolver {
  constructor(private roomSvc: RoomService, private pubsubSvc: PubSubService) {}

  // @PoliciesGuard()
  @Query((_) => GetRoomsOutput, {
    description: GraphqlDescription.API()
      .withPublic()
      .withTitle('Lấy danh sách room')
      .withGroup(API_GROUP)
      .build(),
  })
  async getRooms(@Args('input') input: GetRoomsIntput) {
    return this.roomSvc.getRooms();
  }

  @Subscription((_) => OnRoomSyncedOutPut, {
    description: GraphqlDescription.API()
      .withSub()
      .withPublic()
      .withTitle('Watch synced room')
      .withGroup(API_GROUP)
      .build(),
  })
  async onRoomSynced() {
    return this.pubsubSvc.client.asyncIterator([GraphqlSub.room.onRoomSynced]);
  }

  @PoliciesGuard()
  @Mutation((_) => CreateRoomOutput, {
    description: GraphqlDescription.API().withTitle('Tạo room').withGroup(API_GROUP).build(),
  })
  async createRoom(@Args('input') room: CreateRoomInput, @CurrentUser() user: ReqUser) {
    return this.roomSvc.createNewRoom(room, user);
  }

  @PoliciesGuard()
  @Mutation((_) => DeleteRoomOutput, {
    description: GraphqlDescription.API().withTitle('Xóa room').withGroup(API_GROUP).build(),
  })
  async deleteRoom(@Args('input') input: DeleteRoomIntput) {
    return this.roomSvc.deleteRoom(input.id);
  }
}
