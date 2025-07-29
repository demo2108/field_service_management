import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRequestSummaryController } from './service_request_summary.controller';

describe('ServiceRequestSummaryController', () => {
  let controller: ServiceRequestSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceRequestSummaryController],
    }).compile();

    controller = module.get<ServiceRequestSummaryController>(ServiceRequestSummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
