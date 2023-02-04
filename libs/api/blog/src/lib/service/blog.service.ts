import { Injectable } from '@nestjs/common';
import { ReqUser } from '@noinghe/api/core/lib/dtos';
import { CoreService } from '@noinghe/api/core/lib/services/core.service';
import { SvUnknownError } from '@noinghe/api/core/lib/errors';
import { CreateBlogInput } from '../dtos';
import { BlogEntity } from '../entity/blog.entity';
import { BlogRepository } from '../repository/blog.repository';

@Injectable()
export class BlogService extends CoreService<BlogEntity> {
  constructor(private readonly blogRepo: BlogRepository) {
    super(blogRepo);
  }

  async createNewBlog(newBlog: CreateBlogInput, user: ReqUser) {
    try {
      const blogInstance = this.blogRepo.create({
        title: newBlog.title,
        createdById: user.id,
      });
      return this.blogRepo.save(blogInstance);
    } catch (error) {
      throw new SvUnknownError('Create new blog is error');
    }
  }
}
