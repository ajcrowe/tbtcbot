import { Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { EthereumController } from './ethereum.controller';
import { AppConfigModule } from '../config';
import { DatastoreModule } from 'src/datastore';

@Module({
  imports: [AppConfigModule, DatastoreModule],
  controllers: [EthereumController],
  providers: [EthereumService],
  exports: [EthereumService],
})
export class EthereumModule {}
