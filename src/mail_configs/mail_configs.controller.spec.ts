import { Test, TestingModule } from '@nestjs/testing';
import { MailConfigsController } from './mail_configs.controller';

describe('MailConfigsController', () => {
  let controller: MailConfigsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailConfigsController],
    }).compile();

    controller = module.get<MailConfigsController>(MailConfigsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
