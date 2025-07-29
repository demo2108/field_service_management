import { Test, TestingModule } from '@nestjs/testing';
import { ServiceContractsController } from './service_contracts.controller';

describe('ServiceContractsController', () => {
  let controller: ServiceContractsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceContractsController],
    }).compile();

    controller = module.get<ServiceContractsController>(ServiceContractsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
