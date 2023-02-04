import { Field, InputType, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class SigninByGoogleIntput {
  @Field({ nullable: false })
  token: string;
}

@ObjectType()
export class SigninByGooleOutput {
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
