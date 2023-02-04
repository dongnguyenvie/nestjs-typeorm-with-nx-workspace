import { CustomRepository } from '@noinghe/api/core/lib/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entity/room.entity';

@CustomRepository(RoomEntity)
export class RoomRepository extends Repository<RoomEntity> {}
