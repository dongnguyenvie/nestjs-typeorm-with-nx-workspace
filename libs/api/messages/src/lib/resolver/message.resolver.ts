import { Resolver } from '@nestjs/graphql';
import { MessageService } from '../service/message.service';

@Resolver()
export class MessageResolver {
  constructor(private messageSvc: MessageService) { }

}
