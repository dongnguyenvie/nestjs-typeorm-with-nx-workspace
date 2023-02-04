import { Injectable } from '@nestjs/common';
import { IsNull, Not } from 'typeorm';
import { RoleRepository } from '../repository/role.repository';
import { CoreService } from '@noinghe/api/core/lib/services/core.service';
import { RoleEntity } from '@noinghe/shared/data-access/entities';

@Injectable()
export class RoleService extends CoreService<RoleEntity> {
  constructor(private roleRepo: RoleRepository) {
    super(roleRepo);
  }

  async listWithoutPagi() {
    return this.roleRepo.find();
  }

  async listDeletedWithoutPagi() {
    return this.roleRepo.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
    });
  }

  async listRoleDefault() {
    return this.roleRepo.find({ where: { isDefault: true } });
  }
}
