import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CaslModule,
  configuration,
  envFilePath,
  MemoryCacheModule,
  MyGraphQLModule,
  PubsubModule,
  typeOrmModuleOptions,
} from '@noinghe/api/core';
import { AuthModule } from '@noinghe/api/auth';
import { BlogModule } from '@noinghe/api/blog';
import { ChatModule } from '@noinghe/api/chat';
import { MessageModule } from '@noinghe/api/messages';
import { RoleModule } from '@noinghe/api/roles';
import { RoomModule } from '@noinghe/api/rooms';
import { UserModule } from '@noinghe/api/users';
import { AppController } from './app.controller';
import * as entities from './database/entities-index';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
      load: [configuration],
    }),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    TypeOrmModule.forRoot({
      // charset: 'utf8mb4',
      ...typeOrmModuleOptions,
      entities: Object.values(entities),
      // type: 'postgres',
      // host: process.env.DATABASE_HOST || '127.0.0.1',
      // port: Number(process.env.DATABASE_PORT || 5432),
      // username: process.env.DATABASE_USERNAME,
      // password: process.env.DATABASE_PASSWORD,
      // database: process.env.DATABASE_NAME,
      // autoLoadEntities: true,
      // synchronize: process.env.NODE_ENV === 'development',
      // logger: 'advanced-console',
      // logging: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : 'all',
      // cache: true,
      // dropSchema: false,
      // migrationsTableName: 'migration_table',
      // entities: ['dist/**/*.entity.js'],
      // migrations: ['dist/migration/*.js'],
      // maxQueryExecutionTime: 1000,
      // migrationsRun: false,
      // ssl: false,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ttl: +config.get('THROTTLE_TTL'),
          limit: +config.get('THROTTLE_LIMIT'),
        };
      },
    }),
    MyGraphQLModule,
    CaslModule,
    MemoryCacheModule,
    PubsubModule,
    UserModule,
    AuthModule,
    BlogModule,
    ChatModule,
    MessageModule,
    RoleModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
