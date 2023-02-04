import { GraphqlDescription } from '@noinghe/shared/utils/lib/helpers/description.helper';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ReqUser } from '@noinghe/api/core/lib/dtos';
import { PoliciesGuard } from '@noinghe/api/core/lib/guards/policies.guard';
import { CurrentUser } from '@noinghe/api/core/lib/request';
import {
  DeleteUserInput,
  DeleteUserOuput,
  GetUserInput,
  GetUserOutput,
  GetUsersInput,
  GetUsersOutput,
  RecoverUserInput,
  RecoverUserOutput,
  UpdateUserByAdminInput,
  UpdateUserByAdminOutput,
  UpdateUserInput,
  UpdateUserOutput,
} from '../dtos';
import { UserService } from '../service/user.service';

const API_GROUP = 'user';
@Resolver()
export class UserResolver {
  constructor(private userSvc: UserService) {}

  @PoliciesGuard()
  @Query((_) => GetUsersOutput, {
    description: GraphqlDescription.API().withTitle('Lấy danh sách user').withGroup(API_GROUP).build(),
  })
  async getUsers(@Args('input') input: GetUsersInput) {
    return this.userSvc.list(input);
  }

  @PoliciesGuard()
  @Query((_) => GetUsersOutput, {
    description: GraphqlDescription.API().withTitle('Lấy danh sách user đã xóa').withGroup(API_GROUP).build(),
  })
  async getDeletedUsers(@Args('input') input: GetUsersInput) {
    return this.userSvc.listDeleted(input);
  }

  // @PoliciesGuard()
  @Query((_) => GetUserOutput, {
    description: GraphqlDescription.API()
      .withTitle('Lấy thông tin user')
      .withPublic()
      .withGroup(API_GROUP)
      .build(),
  })
  async getUser(@Args('input') input: GetUserInput) {
    return this.userSvc.findById(input.id, input.relations);
  }

  @PoliciesGuard()
  @Mutation((_) => DeleteUserOuput, {
    description: GraphqlDescription.API().withTitle('Xóa user').withGroup(API_GROUP).build(),
  })
  async deleteUser(@Args('input') input: DeleteUserInput) {
    return this.userSvc.softDeleteById(input.id);
  }

  @PoliciesGuard()
  @Mutation((_) => UpdateUserOutput, {
    description: GraphqlDescription.API()
      .withTitle('Cập nhập thông tin cá nhân')
      .withGroup(API_GROUP)
      .build(),
  })
  async updateUser(@Args('input') input: UpdateUserInput, @CurrentUser() reqUser: ReqUser) {
    return this.userSvc.selfUpdate(input as any, reqUser);
  }

  @PoliciesGuard()
  @Mutation((_) => UpdateUserByAdminOutput, {
    description: GraphqlDescription.API()
      .withTitle('Cập nhập thông tin user by admin')
      .withSystem()
      .withGroup(API_GROUP)
      .build(),
  })
  async updateUserByAdmin(@Args('input') input: UpdateUserByAdminInput, @CurrentUser() reqUser: ReqUser) {
    return this.userSvc.updateByAdmin(input as any, reqUser);
  }

  @PoliciesGuard()
  @Mutation((_) => RecoverUserOutput, {
    description: GraphqlDescription.API().withTitle('khôi phục user').withGroup(API_GROUP).build(),
  })
  async recoverUser(@Args('input') input: RecoverUserInput) {
    return this.userSvc.recoverById(input.id);
  }
}
