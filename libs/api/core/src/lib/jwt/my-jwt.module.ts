import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ACCESS_TOKEN_EXPIRES } from '@noinghe/shared/utils/lib/constants/system.constant';
import { JwtService } from './my.jwt.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configs: ConfigService) => {
        return {
          publicKey: configs.get('PUBLIC_KEY').replace(/\\n/g, '\n'),
          privateKey: configs.get('PRIVATE_KEY').replace(/\\n/g, '\n'),
          signOptions: {
            algorithm: 'RS256',
            expiresIn: configs.get('JWT_EXPIRES_IN') || ACCESS_TOKEN_EXPIRES,
          },
        };
      },
    }),
  ],
  providers: [JwtService],
  exports: [JwtModule, JwtService],
})
export class MyJwtModule {}
