import { Module } from '@nestjs/common';
import { PassHashingService } from './pass-hashing.service';
import { PassHashingController } from './pass-hashing.controller';
import { BcryptProvider } from './bcrypt.provider';
import { passHashingProvider } from './pass-hashing.provider';

@Module({
  controllers: [PassHashingController],
  providers: [
    {
      provide: passHashingProvider,
      useClass: BcryptProvider,
    },
    PassHashingService,
  ],
  exports: [PassHashingService, passHashingProvider],
})
export class PassHashingModule {}
