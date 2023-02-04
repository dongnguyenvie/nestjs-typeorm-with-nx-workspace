import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { DeleteByIdInput, DeleteOutput } from '@noinghe/api/core/lib/dtos';

@InputType()
export class DeleteBlogInput extends DeleteByIdInput {}

@ObjectType()
export class DeleteBlogOutput extends DeleteOutput {}
