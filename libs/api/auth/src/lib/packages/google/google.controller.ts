import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IIncomingRequest, RequestCtx } from '@noinghe/api/core/lib/request';
import { SocialAuthService } from '../../service/social-auth.service';

@Controller('auth/google')
export class GoogleController {
  constructor(public readonly service: SocialAuthService) {}

  @Get('')
  @UseGuards(AuthGuard('google')) // make sure token correct
  googleLogin(@Req() req: any) {
    //
    return {};
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@RequestCtx() requestCtx: IIncomingRequest, @Res() res) {
    const { user } = requestCtx;

    const result = await this.service.validateOAuthLoginEmail(user);
    const isSuccess = !!result.data;
    const { token, id } = result?.data || {};
    return this.service.routeRedirect(!!isSuccess, { token: token, userId: id }, res);
  }
}
