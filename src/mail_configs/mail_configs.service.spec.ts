import { Test, TestingModule } from '@nestjs/testing';
import { MailConfigsService } from './mail_configs.service';

describe('MailConfigsService', () => {
  let service: MailConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailConfigsService],
    }).compile();

    service = module.get<MailConfigsService>(MailConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
