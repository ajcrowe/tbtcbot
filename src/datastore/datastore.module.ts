import { Module } from '@nestjs/common';
import { DatastoreService } from './datastore.service';
import { AppConfigModule } from '../config';

@Module({
  imports: [AppConfigModule],
  providers: [DatastoreService],
  exports: [DatastoreService],
})
export class DatastoreModule {}
