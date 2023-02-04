import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleIntput {
  @Field({})
  id: string;

  @Field((_) => Boolean, { nullable: true })
  isDefault: boolean;

  @Field({ nullable: true })
  title: string;

  @Field((_) => [String], { nullable: true })
  scp: string[];
}

@ObjectType()
export class UpdateRoleOuput {
  @Field()
  id: string;
}
