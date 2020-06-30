import { Injectable, Logger } from '@nestjs/common';
import { WebSocketProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { TBtcContractAbi } from './tbtc.abi';
import { AppConfigService } from '../config';

@Injectable()
export class ChainWatcherService {
  private readonly _logger = new Logger(ChainWatcherService.name);
  private readonly provider: WebSocketProvider
  
  get name(): string {
    return 'ChainWatcherService'
  }
  
  constructor(
    private configService: AppConfigService
  ){
    const { url, network } = this.configService.ethereum
    this.provider = new WebSocketProvider(url, network)
  }

  async getSupply(): Promise<string> {
    try {
      const token = new ethers.Contract(this.configService.tbtc.tokenContract, TBtcContractAbi, this.provider);
      const decimals = await token.decimals()
      const supply = await token.totalSupply()
      return await ethers.utils.formatUnits(supply, decimals)
    } catch (err){
      this._logger.error(err)
    }
  }
}
