import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { AppConfigModule } from '../config';
import { DatastoreModule } from '../datastore';

@Module({
  imports: [AppConfigModule, DatastoreModule],
  providers: [TwitterService],
  exports: [TwitterService],
})
export class TwitterModule {}
