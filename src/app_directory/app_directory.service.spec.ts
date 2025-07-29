import { Test, TestingModule } from '@nestjs/testing';
import { AppDirectoryService } from './app_directory.service';

describe('AppDirectoryService', () => {
  let service: AppDirectoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppDirectoryService],
    }).compile();

    service = module.get<AppDirectoryService>(AppDirectoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
