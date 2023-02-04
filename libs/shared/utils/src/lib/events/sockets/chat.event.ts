export enum MessageType {
  private = 0,
  room = 1,
}

export class ChatEvent {
  type!: MessageType;
  messageType!: MessageType;
  content!: string;
  createBy!: string;
  created!: number;
  to!: string;

  constructor(partial: Partial<ChatEvent>) {
    Object.assign(this, partial);
  }
}
