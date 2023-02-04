import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../repository/message.repository';

@Injectable()
export class MessageService {
  constructor(private messageRepo: MessageRepository) { }


}
