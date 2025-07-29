import { Test, TestingModule } from '@nestjs/testing';
import { LocationMasterService } from './location_master.service';

describe('LocationMasterService', () => {
  let service: LocationMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationMasterService],
    }).compile();

    service = module.get<LocationMasterService>(LocationMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
