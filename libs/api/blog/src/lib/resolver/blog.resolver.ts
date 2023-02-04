import { GraphqlDescription } from '@noinghe/shared/utils/lib/helpers/description.helper';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReqUser } from '@noinghe/api/core/lib/dtos';
import { PoliciesGuard } from '@noinghe/api/core/lib/guards/policies.guard';
import { CurrentUser } from '@noinghe/api/core/lib/request';
import {
  DeleteBlogInput,
  GetBlogsInput,
  GetBlogsOutput,
  CreateBlogInput,
  CreateBlogOutput,
  UpdateBlogInput,
  UpdateBlogOutput,
  DeleteBlogOutput,
} from '../dtos';
import { GetBlogInput, GetBlogOutput } from '../dtos/get-blog.input';
import { BlogService } from '../service/blog.service';

const API_GROUP = 'blog';
@Resolver()
export class BlogResolver {
  constructor(private blogSvc: BlogService) {}

  @PoliciesGuard()
  @Query(() => GetBlogOutput, {
    description: GraphqlDescription.API().withTitle('Lấy thông tin blog').withGroup(API_GROUP).build(),
  })
  async getBlog(@Args('input') input: GetBlogInput) {
    return this.blogSvc.findById(input.id);
  }

  @PoliciesGuard()
  @Query(() => GetBlogsOutput, {
    description: GraphqlDescription.API().withTitle('Lấy danh sách blog').withGroup(API_GROUP).build(),
  })
  async getBlogs(@Args('input') input: GetBlogsInput) {
    return this.blogSvc.list(input);
  }

  @PoliciesGuard()
  @Query(() => GetBlogsOutput, {
    description: GraphqlDescription.API()
      .withTitle('Find deleted Blog by Pagination')
      .withGroup(API_GROUP)
      .build(),
  })
  async getDeletedBlogs(@Args('input') input: GetBlogsInput) {
    return this.blogSvc.listDeleted(input);
  }

  @PoliciesGuard()
  @Mutation(() => CreateBlogOutput, {
    description: GraphqlDescription.API().withTitle('Tạo Blog').withGroup(API_GROUP).build(),
  })
  async createBlog(@Args('input') input: CreateBlogInput, @CurrentUser() user: ReqUser) {
    return this.blogSvc.create(input, user);
  }

  @PoliciesGuard()
  @Mutation(() => UpdateBlogOutput, {
    description: GraphqlDescription.API().withTitle('Sửa Blog').withGroup(API_GROUP).build(),
  })
  async updateBlog(@Args('input') input: UpdateBlogInput) {
    return this.blogSvc.update(input);
  }

  @PoliciesGuard()
  @Mutation(() => DeleteBlogOutput, {
    description: GraphqlDescription.API().withTitle('Xóa Blog').withGroup(API_GROUP).build(),
  })
  async deleteBlog(@Args('input') input: DeleteBlogInput, @CurrentUser() user: ReqUser) {
    return this.blogSvc.softDeleteById(input.id, user);
  }
}
