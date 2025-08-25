import { Injectable } from '@nestjs/common';
import { passHashingProvider } from './pass-hashing.provider';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptProvider implements passHashingProvider {
  async hashPassword(password: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string | Buffer,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
