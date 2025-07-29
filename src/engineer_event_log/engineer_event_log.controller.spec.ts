import { Test, TestingModule } from '@nestjs/testing';
import { EngineerEventLogController } from './engineer_event_log.controller';

describe('EngineerEventLogController', () => {
  let controller: EngineerEventLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EngineerEventLogController],
    }).compile();

    controller = module.get<EngineerEventLogController>(EngineerEventLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
