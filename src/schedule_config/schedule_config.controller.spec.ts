import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleConfigController } from './schedule_config.controller';

describe('ScheduleConfigController', () => {
  let controller: ScheduleConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleConfigController],
    }).compile();

    controller = module.get<ScheduleConfigController>(ScheduleConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
