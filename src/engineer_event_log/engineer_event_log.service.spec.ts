import { Test, TestingModule } from '@nestjs/testing';
import { EngineerEventLogService } from './engineer_event_log.service';

describe('EngineerEventLogService', () => {
  let service: EngineerEventLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EngineerEventLogService],
    }).compile();

    service = module.get<EngineerEventLogService>(EngineerEventLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
