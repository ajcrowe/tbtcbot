import { Test, TestingModule } from '@nestjs/testing';
import { DatastoreService } from './datastore.service';
import { AppConfigModule } from '../config';

describe('DatastoreService', () => {
  let service: DatastoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [DatastoreService],
    }).compile();

    service = module.get<DatastoreService>(DatastoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
