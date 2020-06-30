import { Test, TestingModule } from '@nestjs/testing';
import { ChainWatcherService } from './chainwatcher.service';

describe('ChainWatcherService', () => {
  let service: ChainWatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChainWatcherService],
    }).compile();

    service = module.get<ChainWatcherService>(ChainWatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
