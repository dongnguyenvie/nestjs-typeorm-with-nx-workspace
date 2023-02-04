import { GraphqlSub, ROOM_ID_LENGTH } from '@noinghe/shared/utils/lib/constants';
import { redisHelper } from '@noinghe/shared/utils/lib/helpers/redis.helper';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MemoryCacheService } from '@noinghe/api/core/lib/packages/memory-cache/memory-cache.service';
import { PubSubService } from '@noinghe/api/core/lib/packages/pubsub/pubsub.service';
import { ReqUser } from '@noinghe/api/core/lib/dtos';
import { SvUnknownError } from '@noinghe/api/core/lib/errors';
import ShortUniqueId from 'short-unique-id';
import { CreateRoomInput } from '../dtos/create-room.dto';
import { ALL_ROOM, PREFIX_ROOM_DETAIL } from '../enum';
import { IRoom, IRoomMap } from '../interface';
import { RoomRepository } from '../repository/room.repository';
import dayjs from '@noinghe/shared/utils/lib/libs/dayjs';
import { OnRoomSyncedOutPut } from '../dtos/on-room-synced.dto';
import { RecordAction } from '@noinghe/shared/utils/lib/enums';

const uid = new ShortUniqueId({ length: ROOM_ID_LENGTH });

@Injectable()
export class RoomService {
  constructor(
    private readonly userRepo: RoomRepository,
    private eventEmitter: EventEmitter2,
    private cacheSvc: MemoryCacheService,
    private pubsubSvc: PubSubService,
  ) {}

  async getRooms() {
    const allRoom = ((await this.cacheSvc.client.hgetall(ALL_ROOM)) || {}) as unknown as IRoomMap;
    const data = redisHelper.jsonDecodeObject(allRoom, true);

    return {
      data: data,
      pagination: {},
    };
  }

  async createNewRoom(input: CreateRoomInput, creator: ReqUser) {
    const newRoom: IRoom = {
      id: uid(),
      capacity: input.capacity,
      clients: [],
      creator: {
        id: creator.id,
        avatar: creator.avatar,
        name: creator.name || creator.username,
      },
      description: input.description || '',
      language: input.language,
      topic: input.topic,
      createdAt: dayjs().unix(),
      updatedAt: dayjs().unix(),
    };

    try {
      await this.cacheSvc.client.hset(ALL_ROOM, {
        [newRoom.id]: redisHelper.jsonEncode(newRoom),
      });

      const message = new OnRoomSyncedOutPut({
        action: RecordAction.insert,
        room: newRoom as any,
      });

      this.pubsubSvc.client.publish(GraphqlSub.room.onRoomSynced, {
        onRoomSynced: message,
      });
      return newRoom;
    } catch (error) {}
    throw new SvUnknownError('Create new Room');
  }

  async joinRoom(roomId: string, sid: string, user: ReqUser) {
    try {
      const room = await this.getRoom(roomId);
      const clientIndex = room.clients.findIndex((client) => client.id === user.id);
      if (clientIndex == -1) {
        room.clients.push({
          id: user.id,
          avatar: user.avatar,
          sid: sid,
          name: user.name || user.username,
        });
        room.updatedAt = dayjs().unix();
      } else {
        room.clients[clientIndex] = {
          id: user.id,
          name: user.name || user.username,
          avatar: user.avatar,
          sid: sid,
        };
        room.updatedAt = dayjs().unix();
      }
      this.cacheSvc.client.hset(ALL_ROOM, {
        [room.id]: redisHelper.jsonEncode(room),
      });

      const message = new OnRoomSyncedOutPut({
        action: RecordAction.update,
        room: room as any,
      });
      this.pubsubSvc.client.publish(GraphqlSub.room.onRoomSynced, {
        onRoomSynced: message,
      });
    } catch (error) {}
  }

  async leaveRoom(roomId: string, sid: string, user: ReqUser) {
    try {
      const room = await this.getRoom(roomId);
      if (!!room.clients.find((client) => client.id === user.id)) {
        room.updatedAt = dayjs().unix();
        room.clients = room.clients.filter((client) => client.sid !== sid);
        this.cacheSvc.client.hset(ALL_ROOM, {
          [room.id]: redisHelper.jsonEncode(room),
        });

        const message = new OnRoomSyncedOutPut({
          action: RecordAction.update,
          room: room as any,
        });
        this.pubsubSvc.client.publish(GraphqlSub.room.onRoomSynced, {
          onRoomSynced: message,
        });
      }
    } catch (error) {}
  }

  async deleteRoom(roomId: string) {
    const room = await this.getRoom(roomId);
    // clear room if room exists and there are no client
    if (!!room && !room.clients.length) {
      const message = new OnRoomSyncedOutPut({
        action: RecordAction.delete,
        room: room as any,
      });

      this.pubsubSvc.client.publish(GraphqlSub.room.onRoomSynced, {
        onRoomSynced: message,
      });
      await this.cacheSvc.client.hdel(ALL_ROOM, roomId);
    }
    return {
      id: roomId,
    };
  }

  async addMessage(message: any, room: any) {}

  async findMessages(message: any, room: any) {}

  public getRoomPath(roomId: string) {
    return PREFIX_ROOM_DETAIL + roomId;
  }

  public async getRoom(roomId: string): Promise<IRoom | null> {
    try {
      return JSON.parse(await this.cacheSvc.client.hget(ALL_ROOM, roomId)) as unknown as IRoom;
    } catch (error) {
      return null;
    }
  }

  public hasRoom(roomId: string) {
    return !!this.getRoom(roomId);
  }
}
