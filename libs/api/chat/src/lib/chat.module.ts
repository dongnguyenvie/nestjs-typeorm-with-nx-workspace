import { Module } from '@nestjs/common';
import { MyJwtModule } from '@noinghe/api/core/lib/jwt/my-jwt.module';
import { MemoryCacheModule } from '@noinghe/api/core/lib/packages/memory-cache/memory-cache.module';
import { RoomModule } from '@noinghe/api/rooms';
import { UserModule } from '@noinghe/api/users';
import { ChatGateway } from './chat.gateway';
import { ChatroomService } from './service/chatroom.service';

@Module({
  imports: [MyJwtModule, RoomModule, UserModule],
  providers: [ChatGateway, ChatroomService],
})
export class ChatModule {}
