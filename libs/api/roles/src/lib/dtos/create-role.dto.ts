import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateRoleIntput {
  @Field({})
  title: string;

  @Field((_) => Boolean, { nullable: true })
  isDefault: boolean;

  @Field((_) => [String], {})
  scp: string[];
}

@ObjectType()
export class CreateRoleOutput {
  @Field()
  id: string;
}
