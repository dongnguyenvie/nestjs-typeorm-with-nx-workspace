import { MediaRequest } from '@noinghe/shared/utils/lib/enums/media-request.enum';

export class P2PEvent {
  from!: string;
  to!: string;
  message!: string;
  action: MediaRequest;

  constructor(partial: Partial<P2PEvent>) {
    Object.assign(this, partial);
  }
}
