import { Test, TestingModule } from '@nestjs/testing';
import { CustomerProductsController } from './customer_products.controller';

describe('CustomerProductsController', () => {
  let controller: CustomerProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerProductsController],
    }).compile();

    controller = module.get<CustomerProductsController>(CustomerProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
