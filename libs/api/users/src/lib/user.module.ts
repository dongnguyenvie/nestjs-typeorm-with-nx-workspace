import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@noinghe/api/core';
import { UserRepository } from './repository/user.repository';
import { UserResolver } from './resolver/user.resolver';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
