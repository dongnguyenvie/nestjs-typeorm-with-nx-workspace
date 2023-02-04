export class CallEvent {
  roomId!: string;
  initiator!: boolean;
  callerId!: string;
  signal: any;
  socketId!: string;
  reconnect!: boolean;

  constructor(partial: Partial<CallEvent>) {
    Object.assign(this, partial);
  }

  get expose() {
    return {
      roomId: this.roomId,
      initiator: this.initiator,
      callerId: this.callerId,
      signal: this.signal,
      socketId: this.socketId,
      reconnect: this.reconnect,
    };
  }
}
