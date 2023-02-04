import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('Signup')
export class SignupIntput {
  @Field({
    description: 'Email to login',
  })
  email: string;

  @Field({
    description: 'Password',
  })
  password: string;
}

@ObjectType()
export class SignupOutput {
  @Field({})
  token: string;

  @Field({ nullable: true })
  refreshToken: string;

  @Field({})
  email: string;

  @Field((_) => [String], { defaultValue: [] })
  scp: string[];

  @Field({})
  id: string;
}
