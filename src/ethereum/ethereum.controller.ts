import { Controller, Get, Query } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { DatastoreService } from '../datastore'; 
import { SupplyData, TokenFlowData } from 'src/types';

@Controller()
export class EthereumController {
  constructor(
    private readonly service: EthereumService,
    protected readonly _datastore: DatastoreService
  ) {}

  @Get('supply')
  async getSupply(): Promise<SupplyData> {
    return await this.service.getSupply();
  }

  @Get('flows')
  
  async getMinted(@Query('blocks') blocks: number): Promise<TokenFlowData> {
    return await this.service.getMinted((blocks *-1));
  }
}
