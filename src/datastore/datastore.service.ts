import { Injectable, Logger } from '@nestjs/common';
import {
  InfluxDB,
  Point,
  QueryApi,
  WriteApi,
} from '@influxdata/influxdb-client';
import { AppConfigService } from '../config';
import { InfluxQueryFunc, TokenSupplyData, TokenSupplyMetrics } from '../types';
import CoinGecko from 'coingecko-api';

@Injectable()
export class DatastoreService {
  private readonly _logger = new Logger(this.name);

  private readonly db: InfluxDB;
  private readonly writer: WriteApi;
  private readonly querier: QueryApi;
  private readonly priceFeed: CoinGecko;
  private readonly bucket: string;

  get name(): string {
    return 'InfluxDbService';
  }

  constructor(protected readonly _configService: AppConfigService) {
    const { url, token, org, bucket } = this._configService.influxdb;
    this.db = new InfluxDB({ url, token });
    this.writer = this.db.getWriteApi(org, bucket);
    this.querier = this.db.getQueryApi(org);
    this.priceFeed = new CoinGecko();
    this.bucket = this._configService.influxdb.bucket;
  }

  /**
   * Store a new supply value within Influx
   *
   * @param data The SupplyData to store
   */
  public async storeSupply(data: TokenSupplyData): Promise<void> {
    const points = [
      new Point('supply')
        .floatField('value', data.supply)
        .intField('block_height', data.blockHeight)
    ];
    await this.write(points)
  }

  /**
   * Write poiint to influx
   * 
   * @param point The point to write
   */
  async write(points: Point[]): Promise<void> {
    try {
      points.forEach(point => {
        this.writer.writePoint(point);
      })
      await this.writer.flush();
    } catch (err) {
      this._logger.error(`Failed to write points: ${err}`);
    }
  }

  async getLastBlockHeight(): Promise<number> {
    const query = `from(bucket: "${this.bucket}")
    |> range(start: -1d)
    |> filter(fn: (r) => r["_measurement"] == "supply")
    |> filter(fn: (r) => r["_field"] == "block_height")
    |> ${InfluxQueryFunc.MIN}()`;
    try {
      return Number(
        (await this.querier.collectRows<Record<string, unknown>>(query))[0]
          ._value,
      );
    } catch (err) {
      this._logger.error(`Error querying API with ${query}: ${err}`);
    }
  }

  /**
   * Get the current supply data from Influx
   */
  public async getSupplyData(): Promise<TokenSupplyMetrics> {
    const data: TokenSupplyMetrics = {};
    data.last = await this.query(InfluxQueryFunc.LAST);
    data.previous = await this.query(InfluxQueryFunc.FIRST);
    data.min = await this.query(InfluxQueryFunc.MIN);
    data.max = await this.query(InfluxQueryFunc.MAX);

    data.mcap = await this.getMcap(data.last);
    data.diff = ((data.last / data.previous - 1) * 100).toFixed(2);

    return data;
  }

  /**
   * Query Influx for various meansure of the supply
   * @param func the function to use
   */
  async query(func: InfluxQueryFunc): Promise<number> {
    const query = `from(bucket: "${this.bucket}")
    |> range(start: -1d)
    |> filter(fn: (r) => r["_measurement"] == "supply")
    |> filter(fn: (r) => r["_field"] == "value")
    |> ${func}()`;
    try {
      return Number(
        (await this.querier.collectRows<Record<string, unknown>>(query))[0]
          ._value,
      );
    } catch (err) {
      this._logger.error(`Error querying API with ${query}: ${err}`);
    }
  }

  /**
   * Calculate the USD market cap of the supply
   * @param supply the supply to use for calculating the dollar mcap
   */
  async getMcap(supply: number): Promise<string> {
    interface resp {
      data: {
        bitcoin: {
          usd: number;
        };
      };
    }
    const mcap =
      (
        await this.priceFeed.simple.price<resp>({
          ids: ['bitcoin'],
          vs_currencies: ['usd'],
        })
      ).data.bitcoin.usd * supply;

    return mcap < 999999 ? mcap.toFixed(0) : `${(mcap / 1000000).toFixed(2)}m`;
  }
}
