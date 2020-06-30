import { Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ChainWatcherService } from './chainwatcher';
import { TwitterService } from './twitter';
import { DatastoreService } from './datastore';
import { Jobs } from './types';

@Injectable()
export class AppService {

  private readonly _logger = new Logger(AppService.name);

  get name(): string {
    return 'tBTC Bot'
  }

  constructor(
    private readonly _schedulerRegistry: SchedulerRegistry,
    private readonly _chainWatcher: ChainWatcherService,
    private readonly _twitter: TwitterService,
    private readonly _datastore: DatastoreService,
  ) {
    const supplyJob = new CronJob(CronExpression.EVERY_30_SECONDS, async () => {
      const supply = (await this._chainWatcher.getSupply()).slice(0, -15)
      this._logger.log(`Supply job ran, value: ${supply}`)
      this._datastore.storeSupply(Number(supply))
    });

    const supplyTweet = new CronJob(CronExpression.EVERY_30_SECONDS, async () => {
      const data = await this._datastore.getSupplyData();
      this._logger.log(`Tweet job ran`)
      this._twitter.tweetSupply(data);
    });

    this._schedulerRegistry.addCronJob(Jobs.SUPPLY_TRACKER, supplyJob);
    this._schedulerRegistry.addCronJob(Jobs.SUPPLY_TWEET, supplyTweet);
    supplyJob.start();
    this._logger.log(`Supply monitoring cron job started. Cron pattern: ${CronExpression.EVERY_5_SECONDS}`);
    supplyTweet.start();
    this._logger.log(`Supply tweeting cron job started. Cron pattern: ${CronExpression.EVERY_5_SECONDS}`);
  }
}
