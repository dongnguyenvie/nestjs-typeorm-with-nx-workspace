import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@noinghe/api/core';
import { MessageRepository } from './repository/message.repository';
import { MessageResolver } from './resolver/message.resolver';
import { MessageService } from './service/message.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([MessageRepository])],
  providers: [MessageService, MessageResolver],
  controllers: [],
  exports: [MessageService],
})
export class MessageModule { }
