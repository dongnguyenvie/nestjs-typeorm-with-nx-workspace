import { InputType, ObjectType } from '@nestjs/graphql';
import { GetByIdInput } from '@noinghe/api/core/lib/dtos';
import { BlogEntity } from '../entity/blog.entity';

@InputType()
export class GetBlogInput extends GetByIdInput {}

@ObjectType()
export class GetBlogOutput extends BlogEntity {}
