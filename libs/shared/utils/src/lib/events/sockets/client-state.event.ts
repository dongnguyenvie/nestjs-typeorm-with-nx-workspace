export class ClientStateEvent {
  isVideo!: boolean;
  isAudio!: boolean;
  from!: string;
  roomId!: string;
  watchingId: string | null = null;
  share!: string;

  constructor(partial: Partial<ClientStateEvent>) {
    Object.assign(this, partial);
  }
}
