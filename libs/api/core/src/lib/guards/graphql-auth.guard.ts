import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AbilityAction } from '@noinghe/api/core/lib/casl/casl-ability.enum';
import { CaslAbilityFactory } from '@noinghe/api/core/lib/casl/casl-ability.factory';
import { SvForbiddenError } from '@noinghe/api/core/lib/errors/forbidden.error';
import { SvUnauthorizedError } from '@noinghe/api/core/lib/errors/unauthorized.error';
import { ReqUser } from '@noinghe/api/core/lib/dtos';

@Injectable() // In order to use AuthGuard together with GraphQL, you have to extend
// the built-in AuthGuard class and override getRequest() method.
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private caslAbilityFactory: CaslAbilityFactory) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request;
  }

  handleRequest<T = ReqUser>(err: any, user: T & ReqUser, info: any, context: any): T {
    if (err || !user) {
      throw err || new SvUnauthorizedError('Unauthenticated!');
    }
    // Create ability per user
    const ability = this.caslAbilityFactory.createForUser(user);

    // Get target method
    const methodKey = context.getHandler().name as string; // "create"

    // Check permission
    const isAllow = ability.can(AbilityAction.All, methodKey) || ability.can(AbilityAction.All, 'all');

    if (!isAllow) {
      throw new SvForbiddenError(`You don't have permission to access this resource`);
    }

    // const className = context.getClass().name; // "CatsController"
    // if (!requiredRoles) {
    //   return user;
    // }
    // if (!requiredRoles.some(role => user.roles?.includes(role))) {
    //   throw new ForbiddenError('Forbidden');
    // }
    return user;
  }
}
