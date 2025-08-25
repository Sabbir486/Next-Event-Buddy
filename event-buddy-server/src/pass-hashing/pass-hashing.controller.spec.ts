import { Test, TestingModule } from '@nestjs/testing';
import { PassHashingController } from './pass-hashing.controller';
import { PassHashingService } from './pass-hashing.service';

describe('PassHashingController', () => {
  let controller: PassHashingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassHashingController],
      providers: [PassHashingService],
    }).compile();

    controller = module.get<PassHashingController>(PassHashingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
