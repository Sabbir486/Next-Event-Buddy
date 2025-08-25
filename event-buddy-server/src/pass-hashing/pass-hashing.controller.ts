import { Controller } from '@nestjs/common';
import { PassHashingService } from './pass-hashing.service';

@Controller('pass-hashing')
export class PassHashingController {
  constructor(private readonly passHashingService: PassHashingService) {}
}
