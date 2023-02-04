import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { IEnvironment } from '@noinghe/shared/utils/lib/interfaces';
import { IOauthUser } from '@noinghe/api/core/lib/request';
import { UserService } from '@noinghe/api/users';

@Injectable()
export class SocialAuthService {
  private oauthClient: OAuth2Client;
  private ggClientId: string;

  constructor(
    private authSvc: AuthService,
    private userSvc: UserService,
    private configService: ConfigService,
  ) {
    const ggConfig = this.configService.get('googleConfig') as IEnvironment['googleConfig'];
    this.clientBaseUrl = this.configService.get('clientBaseUrl') as IEnvironment['clientBaseUrl'];
    this.oauthClient = new OAuth2Client(ggConfig.clientId);
    this.ggClientId = ggConfig.clientId;
  }
  protected readonly clientBaseUrl: string;

  // async validateOAuthLogin(emails: any[], social) {
  //   if (!emails.length) {
  //     throw new Error('');
  //   }
  //   let email = emails.find((user) => user.value)?.value;

  //   if (!email) {
  //     throw new Error('');
  //   }

  //   try {
  //     const data = await this.authSvc.signinWithSocial({}, { email, social: social });
  //     return {
  //       error: null,
  //       data: data,
  //     };
  //   } catch (error) {
  //     return {
  //       error: 'unknown',
  //       data: null,
  //     };
  //   }
  // }

  async validateOAuthLoginEmail(user: IOauthUser) {
    if (!user.email) {
      throw new Error('');
    }

    try {
      const data = await this.authSvc.signinWithSocial({}, user);
      return {
        error: null,
        data: data,
      };
    } catch (error) {
      return {
        error: 'unknown',
        data: null,
      };
    }
  }

  async signinByGG(req: any, token: string) {
    const loginTicket = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: this.ggClientId,
    });

    const user = loginTicket.getPayload();

    return this.authSvc.signinWithSocial(req, {
      email: user.email || '',
      accessToken: '',
      avatar: user.picture,
      emails: '',
      fullname: user.name,
      id: '',
      social: 'google',
      verified: user.email_verified,
    });
  }

  routeRedirect(
    success,
    auth: {
      token: string;
      userId: string;
    },
    res: any,
  ) {
    const { userId, token } = auth;

    if (success) {
      return res.redirect(`${this.clientBaseUrl}/auth/callback?token=${token}&userId=${userId}`);
    } else {
      return res.redirect(`${this.clientBaseUrl}/auth/callback?status=0`);
    }
  }
}
