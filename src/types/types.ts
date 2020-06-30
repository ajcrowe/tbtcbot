/**
 * Token supply data type
 */
export interface SupplyData {
  last?: number;
  previous?: number;
  diff?: string;
  max?: number;
  min?: number;
  mcap?: string;
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
