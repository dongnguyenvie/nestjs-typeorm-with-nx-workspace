import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { RelationshipInput, UpdateByIdInput, UpdateOutput } from '@noinghe/api/core/lib/dtos';
import { RoleEntity } from '@noinghe/shared/data-access/entities';

@InputType()
export class UpdateUserByAdminInput extends UpdateByIdInput {
  @Field()
  id: string;

  @Field((_) => [RelationshipInput], { nullable: true })
  roles: RoleEntity[];
}

@ObjectType()
export class UpdateUserByAdminOutput extends UpdateOutput {}
