import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { HealthModule } from './health';
import { TwitterModule } from './twitter';
import { EthereumModule } from './ethereum';
import { DatastoreModule } from './datastore';

@Module({
  imports: [
    HealthModule,
    TwitterModule,
    EthereumModule,
    ScheduleModule.forRoot(),
    DatastoreModule,
  ],
  providers: [AppService],
})
export class AppModule {}
