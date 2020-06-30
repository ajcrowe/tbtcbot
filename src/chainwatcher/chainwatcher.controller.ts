import { Controller, Get } from '@nestjs/common';
import { ChainWatcherService } from './chainwatcher.service';

@Controller('balance')
export class ChainWatcherController {
  constructor(private readonly service: ChainWatcherService) {}

  @Get()
  async getSupply(): Promise<string> {
    return await this.service.getSupply();
  }
}
