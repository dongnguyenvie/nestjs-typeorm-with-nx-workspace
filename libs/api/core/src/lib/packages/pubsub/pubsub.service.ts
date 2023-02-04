import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { PublishEvent } from './pubsub.event';

@Injectable({})
export class PubSubService implements OnModuleInit {
  constructor(private configs: ConfigService) {}
  private _pubsub: RedisPubSub;

  onModuleInit() {
    const options = {
      host: this.configs.get('REDIS_HOST'),
      port: parseInt(this.configs.get('REDIS_PORT')),
      ...(this.configs.get('REDIS_PASSWORD') ? { password: this.configs.get('REDIS_PASSWORD') } : {}),
      retryStrategy: (times) => {
        // reconnect after
        return Math.min(times * 50, 2000);
      },
    };

    const pubsub = new RedisPubSub({
      publisher: new Redis(options),
      subscriber: new Redis(options),
    });

    this._pubsub = pubsub;
  }

  get client() {
    return this._pubsub;
  }

  @OnEvent(PublishEvent.eventNm)
  onPublish(payload: PublishEvent) {
    this.client.publish(payload.trigger, payload.payload);
  }
}
