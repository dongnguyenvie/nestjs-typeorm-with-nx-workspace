import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@noinghe/api/core';
import { RoomRepository } from './repository/room.repository';
import { RoomResolver } from './resolver/room.resolver';
import { RoomService } from './service/room.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([RoomRepository])],
  controllers: [],
  providers: [RoomService, RoomResolver],
  exports: [RoomService],
})
export class RoomModule {}
