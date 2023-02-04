import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@noinghe/api/core';
import { RoleRepository } from './repository/role.repository';
import { RoleResolver } from './resolver/role.resolver';
import { RoleService } from './service/role.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([RoleRepository])],
  providers: [RoleService, RoleResolver],
  controllers: [],
  exports: [RoleService],
})
export class RoleModule {}
