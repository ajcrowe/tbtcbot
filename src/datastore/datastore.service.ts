import { Injectable, Logger } from '@nestjs/common';
import { InfluxDB, Point, QueryApi, WriteApi } from '@influxdata/influxdb-client';
import { AppConfigService } from '../config';
import { SupplyData, SupplyQuery } from '../types';
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
    return 'InfluxDbService'
  }

  constructor(protected readonly _configService: AppConfigService) {
    const { url, token, org, bucket  } = this._configService.influxdb
    this.db = new InfluxDB({url, token});
    this.writer = this.db.getWriteApi(org, bucket);
    this.querier = this.db.getQueryApi(org);
    this.priceFeed = new CoinGecko();
    this.bucket = this._configService.influxdb.bucket;
  }

  public async storeSupply(supply: number): Promise<any> {
    const point = new Point('supply').floatField('value', supply)
    try {
      this.writer.writePoint(point);
      await this.writer.close();
      this._logger.log(`Updated supply with new value ${supply}`);
    } catch (err) {
      this._logger.error(`Failed to update supply ${err}`);
    }
  }

  public async getSupplyData(): Promise<SupplyData> {
    const data: SupplyData = {};
    data.last = await this.query(SupplyQuery.LAST);
    data.previous = await this.query(SupplyQuery.FIRST);
    data.min = await this.query(SupplyQuery.MIN);
    data.max = await this.query(SupplyQuery.MAX);

    data.mcap = await this.getMcap(data.last);
    data.diff = ((data.last/data.previous-1)*100).toFixed(2)

    return data;
  }

  async query(func: string): Promise<number> {
    const query = `from(bucket: "${this.bucket}")
    |> range(start: -1d)
    |> filter(fn: (r) => r["_measurement"] == "supply")
    |> ${func}()`
    try {
      return Number((await this.querier.collectRows<Record<string, unknown>>(query))[0]._value);
    } catch (err) {
      this._logger.error(`Error querying API with ${query}: ${err}`);
    }
  }

  async getMcap(supply: number): Promise<string> {
    interface resp {
      data: {
        bitcoin: {
          usd: number
        }
      }
    }
    const mcap = (await this.priceFeed.simple.price<resp>({
      ids: ['bitcoin'],
      vs_currencies: ['usd'],
    })).data.bitcoin.usd * supply

    return mcap < 9999999 ? mcap.toFixed(0) : `${(mcap / 1000000).toFixed(2)}m`
  }
}