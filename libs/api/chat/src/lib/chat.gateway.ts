import {
  EVENT_MESSAGE_CLIENT,
  EVENT_MESSAGE_SERVER,
  EVENT_ROOM_CLIENT,
  EVENT_ROOM_PERSONAL_CLIENT,
  EVENT_ROOM_SERVER,
  USER_ACCESSABLE,
} from '@noinghe/shared/utils/lib/constants';
import {
  P2PEvent,
  CallEvent,
  JoinRoomEvent,
  ChatEvent,
  MessageType,
} from '@noinghe/shared/utils/lib/events/sockets';
import { ClientStateEvent } from '@noinghe/shared/utils/lib/events/sockets/client-state.event';
import { SyncRoomEvent } from '@noinghe/shared/utils/lib/events/sync-room.event';
import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { ReqUser } from '@noinghe/api/core/lib/dtos';
import { JwtService } from '@noinghe/api/core/lib/jwt/my.jwt.service';
import { Observable } from 'rxjs';
import { Socket, Server } from 'socket.io';
import { ChatroomService } from './service/chatroom.service';
import { RoomService } from '@noinghe/api/rooms';

@WebSocketGateway({
  namespace: 'rooms',
  cors: true,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  connectedUsers: string[] = [];

  constructor(
    private jwtService: JwtService,
    private roomSvc: RoomService,
    private chatroomSvc: ChatroomService,
  ) {}

  afterInit(server: Server) {
    console.log('socket Initialized');
  }

  async handleConnection(socket: Socket) {
    // try {
    //   const user: ReqUser = await this.jwtService.verify((socket.handshake.query as any).token, true);
    //   this.connectedUsers = [...this.connectedUsers, String(user.id)];
    //   //   Send list of connected users
    //   this.server.emit('users', this.connectedUsers);
    // } catch (error) {}
  }

  async handleDisconnect(client: Socket) {
    try {
      const user: ReqUser = await this.jwtService.verify(client.handshake.query.token as string, true);
      // TODO:improve this one, because we need to emit this event to only a room instead of global
      this.server.emit(EVENT_ROOM_CLIENT.leaveRoom, { socketId: client.id });
      this.chatroomSvc.leave({ sid: client.id, reqUser: user });
    } catch (error) {}
  }

  @SubscribeMessage(EVENT_MESSAGE_SERVER.message)
  async onMessage(client: Socket, event: ChatEvent) {
    const user: ReqUser = await this.jwtService.verify(client.handshake.query.token as string, true);
    const { to, messageType } = event;
    // TODO: apply valid here

    event.createBy = user.id;
    event.created = Date.now();

    // await this.roomSvc.addMessage(result.message, result.room);
    if (messageType === MessageType.room) {
      this.server.to(to).emit(EVENT_ROOM_CLIENT.message, event);
    }

    return new Observable((observer) => observer.next({ event, data: event }));
  }

  @SubscribeMessage(EVENT_ROOM_SERVER.joinRoom)
  async onRoomJoin(client: Socket, data: JoinRoomEvent): Promise<any> {
    try {
      const user: ReqUser = await this.jwtService.verify(client.handshake.query.token as string, true);
      const event = new JoinRoomEvent(data);
      const roomId = event.roomId;
      if (!roomId) return;
      // TODO: apply valid here
      const room = await this.roomSvc.getRoom(event.roomId);
      if ((room.clients || []).length >= room.capacity) {
        client.emit(EVENT_ROOM_PERSONAL_CLIENT.accessable, { accessable: USER_ACCESSABLE.full });
        return;
      }

      {
        const newClient = await this.chatroomSvc.join({
          roomId: roomId,
          sid: client.id,
          user: user,
          onSolveDuplicateUserInTheRoom: async (sid) => {
            // incase: user logon in two places, so we need to force the user leave the room
            this.chatroomSvc.leave({ sid: sid, reqUser: user });
            try {
              const _client = (this.server.sockets as any).get(sid);
              if (!_client) return;
              _client.leave(event.roomId);
              // TODO:improve this one, because we need to emit this event to only a room instead of global
              this.server.emit(EVENT_ROOM_CLIENT.leaveRoom, { socketId: sid });
              _client.emit(EVENT_ROOM_PERSONAL_CLIENT.accessable, {
                accessable: USER_ACCESSABLE.duplicateUser,
              });
              client.emit(EVENT_ROOM_PERSONAL_CLIENT.allUsers, { users: [], userInfos: null });
            } catch (error) {
              console.log('error', error);
            }
            // console.log('duplicatedUsers', { sid, sid2: client.id });
            // for (const socket of duplicatedUsers) {
            //   if (socket.id === sid) {
            //     // socket.emit(EVENT_ROOM_PERSONAL_CLIENT.forceDisconnect);
            //     // socket.disconnect(true);
            //   }
            // }
          },
        });
        client.join(event.roomId);

        const newMessage = {
          roomId: event.roomId,
          ...newClient,
          userInfo: {
            id: user.id,
            name: user.name || '',
            avatar: user.avatar,
          },
        };
        this.server.to(event.roomId).except(client.id).emit(EVENT_ROOM_CLIENT.joinRoom, newMessage);
      }

      {
        const allUsers = await this.chatroomSvc.getUsers({
          roomId: event.roomId,
          exceptUserId: user.id,
        });
        const userInfos = await this.chatroomSvc.getPublicUserInfo({
          roomId: event.roomId,
          exceptUserId: client.id,
        });
        client.emit(EVENT_ROOM_PERSONAL_CLIENT.allUsers, { users: allUsers, userInfos: userInfos });
        client.emit(EVENT_ROOM_PERSONAL_CLIENT.accessable, { accessable: USER_ACCESSABLE.accepted });
      }
    } catch (error) {
      console.log({ error });
      throw new WsException(error);
    }
  }

  @SubscribeMessage(EVENT_ROOM_SERVER.call)
  async onCall(client: Socket, event: CallEvent): Promise<any> {
    try {
      const user: ReqUser = await this.jwtService.verify(client.handshake.query.token as string, true);
      const { roomId, callerId } = event;
      if (!roomId) return;
      // const room = await this.roomSvc.findById(roomId);
      // if ((room.clients || []).length >= room.capacity) return;

      client.join(roomId);
      // console.log(`${user.email} join room ${roomId}`);

      // Impl update clients on room after join room
      this.server.to(callerId).emit(
        EVENT_ROOM_CLIENT.callingComing,
        new CallEvent({
          callerId: event.callerId,
          initiator: event.initiator,
          roomId: event.roomId,
          signal: event.signal,
          reconnect: event.reconnect,
          socketId: client.id,
        }).expose,
      );
    } catch (error) {
      console.log({ error });
      throw new WsException(error);
    }
  }

  @SubscribeMessage(EVENT_ROOM_SERVER.leaveRoom)
  onRoomLeave(client, data: any): void {
    client.leave(data[0]);
  }

  @SubscribeMessage(EVENT_ROOM_SERVER.syncUserState)
  async onSyncUserState(client: Socket, data: ClientStateEvent): Promise<void> {
    let newState = await this.chatroomSvc.updateUserState({
      ...data,
      sid: client.id,
    });
    const clientStateEvent = new ClientStateEvent({
      ...newState,
      from: client.id,
    });

    this.server.to(data.roomId).emit(EVENT_ROOM_CLIENT.syncUserState, clientStateEvent);
  }

  @SubscribeMessage(EVENT_ROOM_SERVER.peerToPeer)
  onPeerToPeerMessage(client: Socket, data: P2PEvent): void {
    const p2PEvent = new P2PEvent({
      ...data,
      from: client.id,
    });

    this.server.to(data.to).emit(EVENT_ROOM_CLIENT.peerToPeer, p2PEvent);
  }

  @OnEvent(SyncRoomEvent.NAME)
  emitSyncRoom(payload: SyncRoomEvent) {
    // TODO: impl emit new room or destroyed room ...
    this.server.emit(SyncRoomEvent.EVENT_NAME, payload.expose);
  }
}
