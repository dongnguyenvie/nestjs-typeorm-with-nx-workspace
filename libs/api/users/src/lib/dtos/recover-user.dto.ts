import { InputType, ObjectType } from '@nestjs/graphql';
import { RecoverByIdInput, RecoverOutput } from '@noinghe/api/core/lib/dtos';

@InputType()
export class RecoverUserInput extends RecoverByIdInput {}

@ObjectType()
export class RecoverUserOutput extends RecoverOutput {}
