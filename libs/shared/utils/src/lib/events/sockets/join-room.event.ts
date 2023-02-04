export class JoinRoomEvent {
  roomId!: string;
  sid!: string;
  isAudio!: boolean;
  isVideo!: boolean;

  constructor(partial: Partial<JoinRoomEvent>) {
    Object.assign(this, partial);
  }
}
