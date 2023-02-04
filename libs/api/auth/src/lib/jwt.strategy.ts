import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AUTH_TOKEN } from './constant/auth.constant';

const cookieExtractor = (req: any): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[AUTH_TOKEN];
  }
  return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configs: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configs.get('PUBLIC_KEY').replace(/\\n/g, '\n'),
    });
  }

  async validate(payload: any) {
    return { ...payload };
  }
}
