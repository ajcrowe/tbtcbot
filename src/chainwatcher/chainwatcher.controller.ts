import { Controller, Get } from '@nestjs/common';
import { ChainWatcherService } from './chainwatcher.service';
import { SupplyData } from 'src/types';

@Controller('balance')
export class ChainWatcherController {
  constructor(private readonly service: ChainWatcherService) {}

  @Get()
  async getSupply(): Promise<SupplyData> {
    return await this.service.getSupply();
  }
}
