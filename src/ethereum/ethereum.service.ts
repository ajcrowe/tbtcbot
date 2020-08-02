import { Injectable, Logger } from '@nestjs/common';
import { WebSocketProvider } from '@ethersproject/providers';
import { ethers, Contract } from 'ethers';
import { AppConfigService } from '../config';
import { TokenFlowData, Issuance, TokenSupplyData } from '../types';
import * as TBTCContractJson from '@keep-network/tbtc/artifacts/TBTCToken.json';

@Injectable()
export class EthereumService {
  private readonly _logger = new Logger(EthereumService.name);
  private readonly provider: WebSocketProvider;
  private readonly contract: Contract;

  get name(): string {
    return 'EthereumService';
  }

  constructor(protected readonly configService: AppConfigService) {
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

  public async getSupply(): Promise<TokenSupplyData> {
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
    return {
      burned: (
        await this.getTransferred(
          this.contract.filters.Transfer(null, '0x0000000000000000000000000000000000000000'),
          block
          )
        ),
      minted: (
        await this.getTransferred(
          this.contract.filters.Transfer('0x0000000000000000000000000000000000000000', null),
          block
          )
        )
    }
  }

  async getTransferred(filter: ethers.EventFilter, block: number): Promise<Issuance> {
    let value = 0
    try {
      const txns = await this.contract.queryFilter(filter, block);
      const decimals = await this.contract.decimals()
      txns.forEach(txn => {
        value = value + Number(ethers.utils.formatUnits(
          txn.args.value,
          decimals)
        )        
      });
      return {
        count: txns.length,
        value: Number(value.toFixed(2))
      };
    } catch (err) {
      this._logger.error(err)
    }
  }
}