import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


const defaultJwtAuthGuardParams: JwtAuthGuardParams = {};
interface JwtAuthGuardParams {
  isCheckTFA?: boolean;
}
@Injectable() // In order to use AuthGuard together with GraphQL, you have to extend
// the built-in AuthGuard class and override getRequest() method.
export class RestAuthGuard extends AuthGuard('jwt') {
  constructor(public params = defaultJwtAuthGuardParams) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);

    // if (isPublic) {
    //   // true: the current request is allowed to proceed
    //   return true;
    // }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
