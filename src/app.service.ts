import { Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry, Cron } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ChainWatcherService } from './chainwatcher';
import { TwitterService } from './twitter';
import { DatastoreService } from './datastore';
import { CronJobs } from './types';

@Injectable()
export class AppService {
  private readonly _logger = new Logger(AppService.name);

  get name(): string {
    return 'tBTC Bot';
  }

  constructor(
    private readonly _schedulerRegistry: SchedulerRegistry,
    private readonly _chainWatcher: ChainWatcherService,
    private readonly _twitter: TwitterService,
    private readonly _datastore: DatastoreService,
  ) {
    const supplyJob = new CronJob(CronExpression.EVERY_10_MINUTES, async () => {
      this._logger.log(`Running Job (Update Supply) `);
      const supply = (await this._chainWatcher.getSupply()).slice(0, -15);
      this._datastore.storeSupply(Number(supply));
    });

    const supplyTweet = new CronJob(
      CronExpression.EVERY_DAY_AT_NOON,
      async () => {
        const data = await this._datastore.getSupplyData();
        this._twitter.tweetSupply(data);
        this._logger.log(`Running Job (Daily Tweet) `);
      },
    );

    this._schedulerRegistry.addCronJob(CronJobs.SUPPLY_TRACKER, supplyJob);
    this._schedulerRegistry.addCronJob(CronJobs.SUPPLY_TWEET, supplyTweet);
    supplyJob.start();
    this._logger.log(
      `Supply monitoring cron job started. Cron pattern: ${CronExpression.EVERY_10_MINUTES}`,
    );
    supplyTweet.start();
    this._logger.log(
      `Supply tweeting cron job started. Cron pattern: ${CronExpression.EVERY_DAY_AT_NOON}`,
    );
  }
}
