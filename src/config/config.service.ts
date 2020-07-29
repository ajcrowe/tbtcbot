import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EthereumConfig,
  TwitterConfig,
  TBtcConfig,
  InfluxDbConfig,
} from '../types';
import { TwitterOptions } from 'twitter-lite';

@Injectable()
export class AppConfigService {
  constructor(protected readonly configService: ConfigService) {}

  /**
   * Ethereum client config
   */
  public get ethereum(): EthereumConfig {
    return this.configService.get<EthereumConfig>('ethereum');
  }

  /**
   * tBTC config
   */
  public get twitter(): TwitterOptions {
    const config = this.configService.get<TwitterConfig>('twitter');
    return {
      consumer_key: config.consumerKey,
      consumer_secret: config.consumerSecret,
      access_token_key: config.accessTokenKey,
      access_token_secret: config.accessTokenSecret,
    };
  }

  /**
   * Twitter api client config
   */
  public get tbtc(): TBtcConfig {
    return this.configService.get<TBtcConfig>('tbtc');
  }

  /**
   * Google Firestore config
   */
  public get influxdb(): InfluxDbConfig {
    return this.configService.get<InfluxDbConfig>('influxdb');
  }

  /**
   * Is development
   */
  public get isDevelopment(): boolean {
    return process.env.APP_ENVIRONMENT == 'development' ? true : false
  }
}
