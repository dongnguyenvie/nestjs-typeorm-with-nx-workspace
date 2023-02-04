import { CustomRepository } from '@noinghe/api/core/lib/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  loginByEmail(email: string) {
    const queryBuilder = this.createQueryBuilder('u');
    queryBuilder.where('u.email = :email', { email: email });
    queryBuilder.leftJoinAndSelect('u.roles', 'role');
    queryBuilder
      // .leftJoinAndSelect(
      //     'u.orderMemberships',
      //     'orderM',
      //     'orderM.startTime <= NOW() and orderM.endTime >= NOW() and orderM.status = :status',
      //     {
      //         status: OrderStatus.FINISHED,
      //     },
      // )
      // .leftJoinAndSelect('orderM.membership', 'membership')
      .select([
        'u',
        'role.scp',
        // 'orderM.startTime',
        // 'orderM.endTime',
        // 'orderM.status',
        // 'orderM.dayNumber',
        // 'membership.id',
        // 'membership.scp',
      ]);
    return queryBuilder.getOne();
  }
}
