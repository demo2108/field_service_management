import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleConfigService } from './schedule_config.service';

describe('ScheduleConfigService', () => {
  let service: ScheduleConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleConfigService],
    }).compile();

    service = module.get<ScheduleConfigService>(ScheduleConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
