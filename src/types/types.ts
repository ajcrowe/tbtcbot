/**
 * Token supply data type
 */
export interface SupplyInfluxData {
  last?: number;
  previous?: number;
  diff?: string;
  max?: number;
  min?: number;
  mcap?: string;
}

export interface TokenFlowData {
  burned: Issuance;
  minted: Issuance;
}

export interface Issuance {
  count: number;
  value: number;
}

export interface DailyTweet {
  flow?: TokenFlowData;
  supply?: SupplyInfluxData;
}

export interface SupplyData {
  blockHeight: number;
  supply: number;
}

/**
 * Cronjob names
 */
export enum CronJobs {
  SUPPLY_TRACKER = 'Supply Tracker',
  SUPPLY_TWEET = 'Supply Tweet',
}

/**
 * Supply query functions
 */
export enum SupplyQuery {
  LAST = 'last',
  FIRST = 'first',
  MIN = 'min',
  MAX = 'max',
}
