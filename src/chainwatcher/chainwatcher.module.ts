import { Module } from '@nestjs/common';
import { ChainWatcherService } from './chainwatcher.service';
import { ChainWatcherController } from './chainwatcher.controller';
import { AppConfigModule } from '../config';

@Module({
  imports: [AppConfigModule],
  controllers: [ChainWatcherController],
  providers: [ChainWatcherService],
  exports: [ChainWatcherService],
})
export class ChainWatcherModule {}
