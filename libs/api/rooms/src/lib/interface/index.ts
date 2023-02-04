import { RoomEntity } from '@noinghe/shared/data-access/entities';

export interface ICreateRoom extends Partial<RoomEntity> {}

export interface IRoomUser {
  id: string;
  avatar: string;
  sid: string;
  name: string;
}
export interface IRoom {
  id: string;
  capacity: number;
  description: string;
  language: string;
  creator: Omit<IRoomUser, 'sid'>;
  topic: string;
  clients: IRoomUser[];
  createdAt: number;
  updatedAt: number;
}
export interface IRoomMap extends Record<string, IRoom> {}
