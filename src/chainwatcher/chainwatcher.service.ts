import { Injectable, Logger } from '@nestjs/common';
import { WebSocketProvider } from '@ethersproject/providers';
import { ethers, Contract } from 'ethers';
import { TBtcTokenContractAbi } from './tbtc.abi';
import { AppConfigService } from '../config';

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
      TBtcTokenContractAbi,
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
      return await ethers.utils.formatUnits(supply, decimals);
    } catch (err) {
      this._logger.error(err);
    }
  }

  /*
   * Get all minting transfers from the tBTC contract
   *
   * This is a test, will be a watcher when issuance is
   * possible again
   */
  async getTransfers() {
    const filterFrom = this.contract.filters.Transfer(
      '0x0000000000000000000000000000000000000000',
      null,
    );
    const minted = await this.contract.queryFilter(
      filterFrom,
      7276060,
      8202297,
    );
    console.log(minted);
  }
}
