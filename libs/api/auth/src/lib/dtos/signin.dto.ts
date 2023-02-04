import { Field, InputType, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class SigninIntput {
  @Field({})
  email: string;

  @Field({})
  password: string;
}

@ObjectType()
export class SigninOutput {
  @Field({})
  token: string;

  @Field({ nullable: true })
  refreshToken: string;

  @Field({})
  email: string;

  @Field((_) => [String], { defaultValue: [] })
  scp: string[];

  @Field((_) => GraphQLJSON, { defaultValue: [] })
  memberships: any;

  @Field({})
  id: string;
}
