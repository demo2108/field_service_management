import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrderTypesController } from './work_order_types.controller';

describe('WorkOrderTypesController', () => {
  let controller: WorkOrderTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrderTypesController],
    }).compile();

    controller = module.get<WorkOrderTypesController>(WorkOrderTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
