import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './resolver/auth.resolver';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { MyJwtModule } from '@noinghe/api/core/lib/jwt/my-jwt.module';
import { GoogleStrategy } from './packages/google/google.strategy';
import { SocialAuthService } from './service/social-auth.service';
import { GoogleController } from './packages/google/google.controller';
import { FacebookController } from './packages/facebook/facebook.controller';
import { FacebookStrategy } from './packages/facebook/facebook.strategy';
import { UserModule } from '@noinghe/api/users';
import { RoleModule } from '@noinghe/api/roles';

@Module({
  imports: [ConfigModule, MyJwtModule, PassportModule, UserModule, RoleModule],
  controllers: [GoogleController, FacebookController],
  providers: [AuthService, SocialAuthService, JwtStrategy, GoogleStrategy, AuthResolver, FacebookStrategy],
  exports: [AuthService],
})
export class AuthModule {}
