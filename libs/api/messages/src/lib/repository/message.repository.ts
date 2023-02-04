import { CustomRepository } from '@noinghe/api/core/lib/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { MessageEntity } from '../entity/message.entity';

@CustomRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity> { }
