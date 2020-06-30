import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { HealthModule } from './health';
import { TwitterModule } from './twitter';
import { ChainWatcherModule } from './chainwatcher';
import { DatastoreModule } from './datastore';

@Module({
  imports: [
    HealthModule,
    TwitterModule,
    ChainWatcherModule,
    ScheduleModule.forRoot(),
    DatastoreModule
  ],
  providers: [AppService],
})
export class AppModule {}
