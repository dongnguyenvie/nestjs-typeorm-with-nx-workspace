import { ObjectType } from '@nestjs/graphql';
import { ReqUser } from '@noinghe/api/core/lib/dtos';

@ObjectType()
export class MeOutput extends ReqUser {}
