/**
 * Application Config
 */
export interface AppConfig {
  ethereum: EthereumConfig;
  tbtc: TBtcConfig;
  twitter: TwitterConfig;
  influxdb: InfluxDbConfig;
}

/**
 * Ethereum node config options
 */
export interface EthereumConfig {
  url: string;
  network: string;
}

/**
 * TBTC system configuration
 */
export interface TBtcConfig {
  tokenContract: string;
}

/**
 * Twitter api credentials
 */
export interface TwitterConfig {
  consumerKey: string;
  consumerSecret: string;
  accessTokenKey: string;
  accessTokenSecret: string;
}

/**
 * InfluxDb config
 */
export interface InfluxDbConfig {
  url: string;
  token: string;
  org: string;
  bucket: string;
}
