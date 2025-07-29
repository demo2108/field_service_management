import { Test, TestingModule } from '@nestjs/testing';
import { PartRequestsService } from './part_requests.service';

describe('PartRequestsService', () => {
  let service: PartRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartRequestsService],
    }).compile();

    service = module.get<PartRequestsService>(PartRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
