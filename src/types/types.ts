/**
 * Token supply metrics influx data type
 */
export interface TokenSupplyMetrics {
  last?: number;
  previous?: number;
  diff?: string;
  max?: number;
  min?: number;
  mcap?: string;
}

/**
 * Token Supply data
 */
export interface TokenSupplyData {
  blockHeight: number;
  supply: number;
}

/**
 * Token Flow data (minting/burning)
 */
export interface TokenFlowData {
  burned: Issuance;
  minted: Issuance;
}

/**
 * Issuance value and transaction count
 */
export interface Issuance {
  count: number;
  value: number;
}


/**
 * Daily Tweet status data
 */
export interface DailyTweet {
  flow?: TokenFlowData;
  supply?: TokenSupplyMetrics;
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
export enum InfluxQueryFunc {
  LAST = 'last',
  FIRST = 'first',
  MIN = 'min',
  MAX = 'max',
}
