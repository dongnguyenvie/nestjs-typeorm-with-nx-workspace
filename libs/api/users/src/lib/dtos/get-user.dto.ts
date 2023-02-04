import { InputType, ObjectType } from '@nestjs/graphql';
import { GetByIdInput } from '@noinghe/api/core/lib/dtos';
import { UserEntity } from '../entity/user.entity';

@InputType()
export class GetUserInput extends GetByIdInput {}

@ObjectType()
export class GetUserOutput extends UserEntity {}
