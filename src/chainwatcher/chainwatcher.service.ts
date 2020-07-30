import { Injectable, Logger } from '@nestjs/common';
import { WebSocketProvider } from '@ethersproject/providers';
import { ethers, Contract } from 'ethers';
import { AppConfigService } from '../config';
import { TokenFlowData, Issuance, SupplyData } from '../types';
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

  public async getSupply(): Promise<SupplyData> {
    try {
      return {
        blockHeight: (await this.provider.getBlockNumber()),
        supply: Number(ethers.utils.formatUnits(
          (await this.contract.totalSupply()),
          (await this.contract.decimals())
        ))
      }
    } catch (err) {
      this._logger.error(err);
    }
  }

  async getMinted(block: number): Promise<TokenFlowData> {
    const burnFilter = this.contract.filters.Transfer(null, '0x0000000000000000000000000000000000000000');
    const mintFilter = this.contract.filters.Transfer('0x0000000000000000000000000000000000000000', null);
    try {
      let data: TokenFlowData
      data.burned = await this.getTransferred(burnFilter, block);
      data.minted = await this.getTransferred(mintFilter, block);
      console.log(data);
      return data;
    } catch (err) {
      this._logger.error(err);
    }
  }

  async getTransferred(filter: ethers.EventFilter, block: number): Promise<Issuance> {
    let value: number, count: number;
    try {
      const txns = await this.contract.queryFilter(filter, block);
      count = txns.length
      txns.forEach(txn => {
        console.log(txn.args.value.toNumber());
        //console.log('total: ' + value);
        //value =+ ethers.utils.formatUnits(txn.args.value, this.contract.decimals()))
      });
    } catch (err) {
      this._logger.error(err)
    }
    return {count, value};
  }
}