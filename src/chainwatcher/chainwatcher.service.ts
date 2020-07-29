import { Injectable, Logger } from '@nestjs/common';
import { WebSocketProvider } from '@ethersproject/providers';
import { ethers, Contract } from 'ethers';
import { AppConfigService } from '../config';
import { MintingData } from '../types';
import * as TBTCContractJson from '../contracts/TBTCToken.json';

@Injectable()
export class ChainWatcherService {
  private readonly _logger = new Logger(ChainWatcherService.name);
  private readonly provider: WebSocketProvider;
  private readonly contract: Contract;

  get name(): string {
    return 'ChainWatcherService';
  }

  constructor(private configService: AppConfigService) {
    const { url, network } = this.configService.ethereum;
    this.provider = new WebSocketProvider(url, network);
    this.contract = new ethers.Contract(
      this.configService.tbtc.tokenContract,
      TBTCContractJson.abi,
      this.provider,
    );
  }

  /*
   * Get the current supply from the tBTC token contract
   */

  async getSupply(): Promise<string> {
    try {
      const decimals = await this.contract.decimals();
      const supply = await this.contract.totalSupply();
      const minted = this.getMinted()
      return await ethers.utils.formatUnits(supply, decimals);
    } catch (err) {
      this._logger.error(err);
    }
  }

  async getMinted(): Promise<MintingData> {
    const burnFilter = this.contract.filters.Transfer(null, '0x0000000000000000000000000000000000000000');
    const mintFilter = this.contract.filters.Transfer('0x0000000000000000000000000000000000000000', null);
    try {
      const burnData = await this.getTotalValue(burnFilter);
      const mintData = await this.getTotalValue(mintFilter);
      return {
        burnCount: burnData.count,
        mintCount: mintData.count,
        burned: burnData.value,
        minted: mintData.value,
      }
    } catch (err) {
      this._logger.error(err);
    }
  }

  async getTotalValue(filter: ethers.EventFilter): Promise<{count: number, value: number}> {
    let value: number, count: number;
    try {
      const txns = await this.contract.queryFilter(filter, -6646);
      count = txns.length
      txns.forEach(txn => {
        console.log('total: ' + value)
        value =+ ethers.utils.formatUnits(txn.args.value, this.contract.decimals())
      });
    } catch (err) {
      this._logger.error(err)
    }
    return {count, value};
  }
}