import { Test, TestingModule } from '@nestjs/testing';
import { ServiceContractsService } from './service_contracts.service';

describe('ServiceContractsService', () => {
  let service: ServiceContractsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceContractsService],
    }).compile();

    service = module.get<ServiceContractsService>(ServiceContractsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
