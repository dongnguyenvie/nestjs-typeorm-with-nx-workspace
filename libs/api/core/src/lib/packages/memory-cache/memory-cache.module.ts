import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MemoryCacheService } from './memory-cache.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { IEnvironment } from '@noinghe/shared/utils/lib/interfaces';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisConfig = config.get('redisConfig') as IEnvironment['redisConfig'];

        return {
          config: {
            host: redisConfig.host,
            port: redisConfig.port,
            db: redisConfig.db || 0,
            password: redisConfig.password,
          },
        };
      },
    }),
    // RedisModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     const _redisConfig = {
    //       host: process.env.REDIS_HOST,
    //       port: parseInt(process.env.REDIS_PORT),
    //       db: parseInt(process.env.REDIS_DB),
    //       password: process.env.REDIS_PASSWORD,
    //       keyPrefix: process.env.REDIS_PRIFIX,
    //     };
    //     return _redisConfig as any;
    //   },
    // }),
  ],
  providers: [MemoryCacheService],
  exports: [MemoryCacheService],
})
export class MemoryCacheModule {}
