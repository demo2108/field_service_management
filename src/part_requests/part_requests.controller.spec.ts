import { Test, TestingModule } from '@nestjs/testing';
import { PartRequestsController } from './part_requests.controller';

describe('PartRequestsController', () => {
  let controller: PartRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartRequestsController],
    }).compile();

    controller = module.get<PartRequestsController>(PartRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
