import { Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry, Cron } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ChainWatcherService } from './chainwatcher';
import { TwitterService } from './twitter';
import { DatastoreService } from './datastore';
import { CronJobs, DailyTweet } from './types';

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
    const supplyJob = new CronJob(CronExpression.EVERY_30_SECONDS, async () => {
      this._logger.log(`Running Job (Update Supply) `);
      this._datastore.storeSupply(await this._chainWatcher.getSupply());
    });

    const supplyTweet = new CronJob(
      CronExpression.EVERY_MINUTE,
      async () => {
        const data: DailyTweet = {}
        data.supply = await this._datastore.getSupplyData();
        data.flow = await this._chainWatcher.getMinted(await this._datastore.getLastBlockHeight());
        this._twitter.tweetSupply(data);
        this._logger.log(`Running Job (Daily Tweet) `);
      },
    );

    this._schedulerRegistry.addCronJob(CronJobs.SUPPLY_TRACKER, supplyJob);
    this._schedulerRegistry.addCronJob(CronJobs.SUPPLY_TWEET, supplyTweet);
    supplyJob.start();
    this._logger.log(
      `Supply monitoring cron job started. Cron pattern: ${CronExpression.EVERY_30_SECONDS}`,
    );
    supplyTweet.start();
    this._logger.log(
      `Supply tweeting cron job started. Cron pattern: ${CronExpression.EVERY_MINUTE}`, //EVERY_DAY_AT_NOON
    );
  }
}
