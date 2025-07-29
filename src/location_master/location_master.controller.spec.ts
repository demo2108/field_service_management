import { Test, TestingModule } from '@nestjs/testing';
import { LocationMasterController } from './location_master.controller';

describe('LocationMasterController', () => {
  let controller: LocationMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationMasterController],
    }).compile();

    controller = module.get<LocationMasterController>(LocationMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
