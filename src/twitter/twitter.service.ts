import { Injectable, Logger } from '@nestjs/common';
import Twitter from 'twitter-lite'
import { AppConfigService } from '../config';
import { DatastoreService } from '../datastore';
import { SupplyData } from '../types';
import moment from 'moment';

@Injectable()
export class TwitterService {
  
  private readonly _logger = new Logger(this.name);
  private readonly twitter: Twitter

  get name(): string {
    return 'TwitterService';
  }

  constructor(
    protected readonly configService: AppConfigService,
    protected readonly datastoreService: DatastoreService
  ) {
    this.twitter = new Twitter(this.configService.twitter);
  }

  public async tweetSupply(data: SupplyData): Promise<any> {
    const status = this.formatSupply(data);
    try {
      await this.twitter.post("statuses/update", {status});
      this._logger.log(`Tweeted:\n ${status}`);
    } catch (err) {
      this._logger.error(err)
    }
  }

  formatSupply(data: SupplyData): string {
    const emojis = Number(data.diff) > 0 ? [`📈`,`⬆️`] : [`📉`, `⬇️`]
    return `
📅 tBTC Update for ${moment().format("MMM Do YYYY")}

💰 Total Supply: ₿${data.last} ($${data.mcap})
${emojis[0]} Daily Change: ₿${(data.last - data.previous).toFixed(2)} (${data.diff}%)

↕️ Daily Min/Max: ₿${data.min}/${data.max}`
  }
}
