import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { IEnvironment } from '@noinghe/shared/utils/lib/interfaces';
import { IOauthUser } from '@noinghe/api/core/lib/request';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: ConfigService) {
    super(config(configService));
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    try {
      const { emails } = profile;
      const id = profile.id;
      const fullname = profile.displayName;
      const avatar = (profile.photos || []).find((photo) => photo.value)?.value || '';
      const email = (profile.emails || []).find((email) => email.value)?.value || '';

      const user: IOauthUser = {
        emails,
        accessToken,
        verified: true,
        avatar,
        email,
        fullname,
        id,
        social: 'facebook',
      };
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}

export const config = (configService: ConfigService) => {
  const FACEBOOK_CONFIG = configService.get('facebookConfig') as IEnvironment['facebookConfig'];
  const { baseUrl } = configService.get('apiConfigOptions') as IEnvironment['apiConfigOptions'];

  return {
    clientID: FACEBOOK_CONFIG.clientId || 'disabled',
    clientSecret: FACEBOOK_CONFIG.clientSecret || 'disabled',
    callbackURL: FACEBOOK_CONFIG.oauthRedirectUri || `${baseUrl}/api/auth/facebook/callback`,
    scope: 'email',
    profileFields: ['emails', 'displayName', 'picture', 'id'],
  };
};
