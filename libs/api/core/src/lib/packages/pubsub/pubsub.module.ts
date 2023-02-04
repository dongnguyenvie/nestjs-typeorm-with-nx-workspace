import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PubSubService } from './pubsub.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PubSubService],
  controllers: [],
  exports: [PubSubService],
})
export class PubsubModule {}
