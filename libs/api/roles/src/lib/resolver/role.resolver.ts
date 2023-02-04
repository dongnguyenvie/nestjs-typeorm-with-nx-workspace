import { PoliciesGuard } from '@noinghe/api/core/lib/guards/policies.guard';
import { GraphqlDescription } from '@noinghe/shared/utils/lib/helpers/description.helper';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoleService } from '../service/role.service';
import {
  UpdateRoleIntput,
  RecoverRoleIntput,
  GetRoleByIdInput,
  DeleteRoleIntput,
  CreateRoleIntput,
  GetRolesOutput,
  GetDeletedRolesOutput,
  GetRoleByIdOutput,
  CreateRoleOutput,
  UpdateRoleOuput,
  DeleteRoleOutput,
  RecoverRoleOutput,
} from '../dtos';
import { ReqUser } from '@noinghe/api/core/lib/dtos';
import { CurrentUser } from '@noinghe/api/core/lib/request';

@Resolver()
export class RoleResolver {
  constructor(private roleSvc: RoleService) {}

  @PoliciesGuard()
  @Query((_) => [GetRolesOutput], {
    description: GraphqlDescription.API().withTitle('Lấy danh sách vai trò').withGroup('role').build(),
  })
  getRoles() {
    return this.roleSvc.listWithoutPagi();
  }

  @PoliciesGuard()
  @Query((_) => [GetDeletedRolesOutput], {
    description: GraphqlDescription.API()
      .withTitle('Danh sách vai trò đã xóa')
      .withSystem()
      .withGroup('role')
      .build(),
  })
  async getDeletedRoles() {
    return this.roleSvc.listDeletedWithoutPagi();
  }

  @PoliciesGuard()
  @Query((_) => GetRoleByIdOutput, {
    description: GraphqlDescription.API().withTitle('Lấy vai trò bằng ID').withGroup('role').build(),
  })
  getRoleById(@Args('input') role: GetRoleByIdInput) {
    return this.roleSvc.findById(role.id);
  }

  @PoliciesGuard()
  @Mutation((_) => CreateRoleOutput, {
    description: GraphqlDescription.API().withTitle('Tạo vai trò người dùng').withGroup('role').build(),
  })
  createRole(@Args('input') role: CreateRoleIntput, @CurrentUser() user: ReqUser) {
    return this.roleSvc.create(role, user);
  }

  @PoliciesGuard()
  @Mutation((_) => UpdateRoleOuput, {
    description: GraphqlDescription.API().withTitle('Cập nhập vai trò người dùng').withGroup('role').build(),
  })
  updateRole(@Args('input') role: UpdateRoleIntput) {
    return this.roleSvc.update(role);
  }

  @PoliciesGuard()
  @Mutation((_) => DeleteRoleOutput, {
    description: GraphqlDescription.API().withTitle('Xóa vai trò người dùng').withGroup('role').build(),
  })
  deleteRole(@Args('input') post: DeleteRoleIntput, @CurrentUser() user: ReqUser) {
    return this.roleSvc.softDeleteById(post.id, user);
  }

  @PoliciesGuard()
  @Mutation((_) => RecoverRoleOutput, {
    description: GraphqlDescription.API().withTitle(`Phục hồi quyền`).withSystem().withGroup('role').build(),
  })
  recoverRole(@Args('input') role: RecoverRoleIntput) {
    return this.roleSvc.recoverById(role.id);
  }
}
