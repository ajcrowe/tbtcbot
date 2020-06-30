/*
 * Application Config
 */
export interface AppConfig {
  ethereum: EthereumConfig,
  tbtc: TBtcConfig,
  twitter: TwitterConfig,
  influxdb: InfluxDbConfig,
}

/*
 * Ethereum node config options
 */
export interface EthereumConfig {
  url: string,
  network: string,
}

/*
 * TBTC system configuration
 */
export interface TBtcConfig {
  tokenContract: string,
}

/*
 * Twitter api credentials
 */
export interface TwitterConfig {
  consumerKey: string,
  consumerSecret: string,
  accessTokenKey: string,
  accessTokenSecret: string,
}

/*
 * InfluxDb config
 */
export interface InfluxDbConfig {
  url: string
  token: string
  org: string
  bucket: string
}

/* 
 * Token supply data type
 */
export interface SupplyData {
  last?: number
  previous?: number
  diff?: string
  max?: number
  min?: number
  mcap?: string
}

/*
 * Cronjob names
 */
export enum Jobs {
  SUPPLY_TRACKER = 'Supply Tracker',
  SUPPLY_TWEET = 'Supply Tweet'
}

/*
 * Supply query functions
 */
export enum SupplyQuery {
  LAST = 'last',
  FIRST = 'first',
  MIN = 'min',
  MAX = 'max'
}
