import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoriesController } from './product_categories.controller';

describe('ProductCategoriesController', () => {
  let controller: ProductCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoriesController],
    }).compile();

    controller = module.get<ProductCategoriesController>(ProductCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
