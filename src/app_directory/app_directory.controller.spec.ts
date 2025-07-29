import { Test, TestingModule } from '@nestjs/testing';
import { AppDirectoryController } from './app_directory.controller';

describe('AppDirectoryController', () => {
  let controller: AppDirectoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppDirectoryController],
    }).compile();

    controller = module.get<AppDirectoryController>(AppDirectoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
