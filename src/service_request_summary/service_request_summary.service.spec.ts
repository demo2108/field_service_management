import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRequestSummaryService } from './service_request_summary.service';

describe('ServiceRequestSummaryService', () => {
  let service: ServiceRequestSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceRequestSummaryService],
    }).compile();

    service = module.get<ServiceRequestSummaryService>(ServiceRequestSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
