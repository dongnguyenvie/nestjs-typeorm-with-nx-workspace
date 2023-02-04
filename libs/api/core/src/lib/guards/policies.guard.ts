import { applyDecorators, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './graphql-auth.guard';
import { RestAuthGuard } from './rest-auth.guard';

export function PoliciesGuard(payload = { isGraphql: true }) {
  if (payload.isGraphql) {
    return applyDecorators(UseGuards(GqlAuthGuard));
  }
  return applyDecorators(UseGuards(RestAuthGuard));
}
