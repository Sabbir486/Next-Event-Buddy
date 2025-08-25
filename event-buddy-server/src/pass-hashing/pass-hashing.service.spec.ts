import { Test, TestingModule } from '@nestjs/testing';
import { PassHashingService } from './pass-hashing.service';

describe('PassHashingService', () => {
  let service: PassHashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassHashingService],
    }).compile();

    service = module.get<PassHashingService>(PassHashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
