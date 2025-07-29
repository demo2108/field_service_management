import { Test, TestingModule } from '@nestjs/testing';
import { ContactPersonController } from './contact_person.controller';

describe('ContactPersonController', () => {
  let controller: ContactPersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactPersonController],
    }).compile();

    controller = module.get<ContactPersonController>(ContactPersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
