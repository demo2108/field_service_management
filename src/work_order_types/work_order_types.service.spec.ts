import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrderTypesService } from './work_order_types.service';

describe('WorkOrderTypesService', () => {
  let service: WorkOrderTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkOrderTypesService],
    }).compile();

    service = module.get<WorkOrderTypesService>(WorkOrderTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
