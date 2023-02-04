import { PREFIX_SOCKET } from '@noinghe/shared/utils/lib/constants';
import { redisHelper } from '@noinghe/shared/utils/lib/helpers/redis.helper';
import { Injectable } from '@nestjs/common';
import { ReqUser } from '@noinghe/api/core/lib/dtos';
import { MemoryCacheService } from '@noinghe/api/core/lib/packages/memory-cache/memory-cache.service';
import { removeObjectEmpty } from '@noinghe/api/core/lib/utils';
import dayjs from '@noinghe/shared/utils/lib/libs/dayjs';
import { RoomService } from '@noinghe/api/rooms';
import { UserService } from '@noinghe/api/users';

type SocketID = string;
interface User {
  isAudio: boolean;
  isVideo: boolean;
  sid: SocketID; // socket id
  wid: SocketID; // watching id
  id: string; // user id
  join: number;
  // avatar: string;
}
type RoomID = string;
interface RoomMetaData {
  roomId: RoomID;
  sid: SocketID;
}

@Injectable()
export class ChatroomService {
  rooms = {} as Record<RoomID, Record<SocketID, User>>;

  constructor(
    private roomSvc: RoomService,
    private cacheSvc: MemoryCacheService,
    private userSvc: UserService,
  ) {
    // setInterval(() => {
    //   console.log(this.rooms);
    // }, 3000);
  }

  private get _db() {
    return this.cacheSvc.client;
  }

  private getSocketPath(socketId: string) {
    return PREFIX_SOCKET + socketId;
  }

  private async _getUser({ roomId, sid: userId }: RoomMetaData): Promise<User> {
    // return this.rooms[roomId][userId];
    const roomPath = this.roomSvc.getRoomPath(roomId);
    const user = redisHelper.jsonDecode<User>(await this._db.hget(roomPath, userId));
    return user;
  }

  private async _createUserOrRoom({
    roomId,
    sid: userId,
    user,
  }: RoomMetaData & { user: User }): Promise<User> {
    // if (!this.rooms[roomId]) {
    //   this.rooms[roomId] = {};
    // }
    // this.rooms[roomId][userId] = user;
    const roomPath = this.roomSvc.getRoomPath(roomId);
    this._db.hset(roomPath, {
      [userId]: redisHelper.jsonEncode(user),
    });
    return user;
  }

  private async _createUserStateInRoom({
    roomId,
    sid,
    user,
    reqUser,
  }: RoomMetaData & { user: User; reqUser: ReqUser }): Promise<User> {
    // if (!this.rooms[roomId]) {
    //   this.rooms[roomId] = {};
    // }
    // this.rooms[roomId][userId] = user;
    if (!this.roomSvc.hasRoom(roomId)) {
      throw Error('room is not exists');
    }
    // update user in homepage
    this.roomSvc.joinRoom(roomId, sid, reqUser);

    this._db.lpush(this.getSocketPath(sid), roomId);
    const roomPath = this.roomSvc.getRoomPath(roomId);
    this._db.hset(roomPath, {
      [sid]: redisHelper.jsonEncode(user),
    });
    return user;
  }

  private async _updateUser({ roomId, sid: userId, user }: RoomMetaData & { user: User }) {
    // this.rooms[roomId][userId] = user;
    const roomPath = this.roomSvc.getRoomPath(roomId);
    this._db.hset(roomPath, {
      [userId]: redisHelper.jsonEncode(user),
    });
  }

  private async _getAllUserInRoom({ roomId }: Pick<RoomMetaData, 'roomId'>): Promise<Record<SocketID, User>> {
    // return this.rooms[roomId];
    const roomPath = this.roomSvc.getRoomPath(roomId);
    const userMap = redisHelper.jsonDecodeObject(await this._db.hgetall(roomPath));
    return userMap as any;
  }

  private async _delete({ sid, reqUser }: Pick<RoomMetaData, 'sid'> & { reqUser: ReqUser }): Promise<void> {
    // Object.keys(this.rooms).forEach((roomId) => {
    //   delete this.rooms[roomId][userId];
    // });
    const userPath = this.getSocketPath(sid);
    const length = await this._db.llen(userPath);
    const roomIds = await this._db.lrange(userPath, 0, length);
    roomIds.forEach((roomId) => {
      const roomPath = this.roomSvc.getRoomPath(roomId);
      this._db.hdel(roomPath, sid);
      this.roomSvc.leaveRoom(roomId, sid, reqUser);
    });
    this._db.del(userPath);
  }

  async join({
    roomId,
    sid,
    user,
    onSolveDuplicateUserInTheRoom,
  }: RoomMetaData & { user: ReqUser; onSolveDuplicateUserInTheRoom: (sid: string) => void }): Promise<User> {
    // disconect user before join other place
    const roomUsers = await this.getUsers({ roomId: roomId });
    const userFound = roomUsers.find((u) => u.id === user.id);
    if (!!userFound) {
      await onSolveDuplicateUserInTheRoom(userFound.sid);
    }

    const newClient = {
      isAudio: false,
      isVideo: false,
      sid: sid,
      wid: null,
      share: null,
      id: user.id,
      join: dayjs().unix(),
    };
    this._createUserStateInRoom({
      roomId,
      sid: sid,
      user: newClient,
      reqUser: user,
    });

    return newClient;
  }

  async leave({ sid, reqUser }: Pick<RoomMetaData, 'sid'> & { reqUser: ReqUser }): Promise<void> {
    this._delete({ sid, reqUser });
  }

  async getUsers({ roomId, exceptUserId }: { roomId: RoomID; exceptUserId?: SocketID }): Promise<User[]> {
    const allusers = await this._getAllUserInRoom({ roomId: roomId });
    return Object.values(allusers).filter((user) => user.id !== exceptUserId);
  }

  async getPublicUserInfo({ roomId, exceptUserId }: { roomId: RoomID; exceptUserId?: SocketID }) {
    const allusers = await this._getAllUserInRoom({ roomId: roomId });
    const userIds = Object.values(allusers).map((user) => user.id);
    const foundUsers = await this.userSvc.findUsersByIds(userIds);
    const userInfos = (foundUsers || []).map((user) => ({
      id: user.id,
      avatar: user.avatar,
      name: user.fullName || user.email,
    }));
    return userInfos;
  }

  async getUser({ roomId, sid }: RoomMetaData): Promise<User> {
    return this._getUser({ roomId, sid });
  }

  async updateUserState({
    sid,
    roomId,
    ...userState
  }: RoomMetaData & Partial<Omit<User, 'sid'>>): Promise<User> {
    const newState = removeObjectEmpty(userState) as any;

    let client = await this._getUser({ roomId, sid: sid });
    client = {
      ...(client || {}),
      ...newState,
    };

    this._updateUser({ roomId: roomId, sid: sid, user: client });

    return client;
  }
}
