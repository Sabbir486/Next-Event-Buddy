import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UserService } from 'src/user/user.service';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly generateTokensProvider: GenerateTokensProvider,

    private readonly userService: UserService,
  ) {}
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { user_id } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'user_id'>
      >(refreshTokenDto.refreshToken, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      });

      const user = await this.userRepo.findOne({
        where: { user_id },
        relations: ['role_id'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.generateTokensProvider.generateTokens(
        user,
        user.role_id.role_name,
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException('User not found');
      }
      console.error('Error verifying refresh token:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
