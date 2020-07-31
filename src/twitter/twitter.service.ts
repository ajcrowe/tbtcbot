import { Injectable, Logger } from '@nestjs/common';
import Twitter from 'twitter-lite';
import { AppConfigService } from '../config';
import { DailyTweet } from '../types';
import moment from 'moment';

@Injectable()
export class TwitterService {
  private readonly _logger = new Logger(this.name);
  private readonly twitter: Twitter;

  get name(): string {
    return 'TwitterService';
  }

  constructor(protected readonly configService: AppConfigService) {
    this.twitter = new Twitter(this.configService.twitter);
  }

  /**
   * Tweet the supply data
   * @param data populated supply data object
   */
  public async tweetSupply(data: DailyTweet): Promise<any> {
    const status = this.formatSupply(data);
    if (!this.configService.isDevelopment) {
      try {
        await this.twitter.post('statuses/update', { status });
        this._logger.log(`Tweeted:\n ${status}`);
      } catch (err) {
        this._logger.error(err);
      }
    } else {
      console.log(status);
    }
  }

  /**
   * Format the status update using the supply data
   * @param data populated supply data object
   */
  formatSupply(data: DailyTweet): string {
    const supply = data.supply
    const emojis = Number(supply.diff) > 0 ? [`📈`, `⬆️`] : [`📉`, `⬇️`];
    return `
📅 tBTC Update for ${moment().format('MMM Do YYYY')}

💰 Total Supply: ₿${supply.last} ($${supply.mcap})
${emojis[0]} Daily Change: ₿${(supply.last - supply.previous).toFixed(2)} (${
      supply.diff
    }%)

↕️ Daily Min/Max: ₿${supply.min}/${supply.max}

📈 Minted: ₿${data.flow.minted.value} in ${data.flow.minted.count} tnxs
📉 Burned: ₿${data.flow.burned.value} in ${data.flow.burned.count} tnxs`;
  }
}
