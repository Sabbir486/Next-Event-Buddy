import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { passHashingProvider } from 'src/pass-hashing/pass-hashing.provider';
import { UserService } from 'src/user/user.service';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { SignInDto } from './dtos/signin.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly userService: UserService,
    private readonly hashProvider: passHashingProvider,
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  async signIn(signInDto: SignInDto) {
    let user = await this.userRepo.findOne({
      where: { email: signInDto.email },
      relations: {
        role_id: true,
      },
    });
    if (!user) {
      return { message: 'User not found' };
    }
    let isEqual: boolean = false;

    try {
      isEqual = await this.hashProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      return { message: 'Error comparing password', error };
    }

    if (!isEqual) {
      return { message: 'Password is incorrect' };
    }

    return await this.generateTokensProvider.generateTokens(
      user,
      user.role_id.role_name,
    );
  }
}
