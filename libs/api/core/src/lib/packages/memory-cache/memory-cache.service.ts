import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class MemoryCacheService implements OnModuleInit {
  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {}

  // async get(key, defaultValue = undefined) {
  //   try {
  //     return (await this.cache.get(key)) || defaultValue;
  //   } catch (error) {
  //     return defaultValue;
  //   }
  // }

  // async wrap(...keys: any[]) {
  //   try {
  //     return await this.cache.wrap<string>(...keys);
  //   } catch (error) {}
  // }

  // async set(key, value, ttl: number = undefined) {
  //   const option = getOption(ttl);
  //   try {
  //     await this.cache.set(key, value, option);
  //   } catch (error) {
  //     console.log('RedisCacheService error', error);
  //   }
  // }

  get client() {
    return this.redisService.getClient();
  }

  // @OnEvent(eventNames.MEMORY_CACHE_SET)
  // onSet(payload: CacheSetEvent) {
  //   this.set(payload.key, payload.payload);
  // }
}
