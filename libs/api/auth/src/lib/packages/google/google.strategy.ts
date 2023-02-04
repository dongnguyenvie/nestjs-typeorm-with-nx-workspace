import { IEnvironment } from '@noinghe/shared/utils/lib/interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { IOauthUser } from '@noinghe/api/core/lib/request';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super(config(configService));
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const { name, emails, photos } = profile;
      const fullname = profile?.displayName || '';
      const id = profile?.id;
      const email = (profile.emails || []).find((email) => email.value);
      const avatar = (profile.photos || []).find((photo) => photo.value)?.value || '';

      const user: IOauthUser = {
        emails,
        email: email?.value || '',
        verified: email?.verified || false,
        avatar,
        id,
        fullname,
        accessToken,
        social: 'google',
      };
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}

export const config = (configService: ConfigService) => {
  const GOOGLE_CONFIG = configService.get('googleConfig') as IEnvironment['googleConfig'];
  const { baseUrl } = configService.get('apiConfigOptions') as IEnvironment['apiConfigOptions'];

  return {
    clientID: GOOGLE_CONFIG.clientId || 'disabled',
    clientSecret: GOOGLE_CONFIG.clientSecret || 'disabled',
    callbackURL: GOOGLE_CONFIG.callbackUrl || `${baseUrl}/api/auth/google/callback`,
    passReqToCallback: true,
    scope: ['email', 'profile'],
  };
};
