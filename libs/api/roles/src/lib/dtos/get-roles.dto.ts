import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetRolesOutput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field((_) => Boolean)
  isDefault: boolean;

  @Field((_) => [String])
  scp: string[];
}

@ObjectType()
export class GetDeletedRolesOutput extends GetRolesOutput {}
