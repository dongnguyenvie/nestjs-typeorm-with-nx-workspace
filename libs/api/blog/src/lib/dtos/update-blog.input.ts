import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class UpdateBlogInput {
  @Field({ nullable: false })
  id!: string;

  @Field({ nullable: false })
  title!: string;
}

@ObjectType()
export class UpdateBlogOutput {
  @Field({ nullable: false })
  id!: string;

  @Field({ nullable: false })
  title!: string;
}
