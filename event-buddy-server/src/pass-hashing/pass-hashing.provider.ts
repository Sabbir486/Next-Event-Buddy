import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class passHashingProvider {
  abstract hashPassword(password: string | Buffer): Promise<string>;

  abstract comparePassword(
    password: string | Buffer,
    hashedPassword: string,
  ): Promise<boolean>;
}
