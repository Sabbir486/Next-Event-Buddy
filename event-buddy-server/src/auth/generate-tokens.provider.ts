import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(user_id: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        user_id: user_id,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: expiresIn,
        secret: this.jwtConfiguration.secret,
      },
    );
  }

  public async generateTokens(user: User, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.user_id,
        this.jwtConfiguration.accessTokenExpire,
        {
          user_id: user.user_id,
          role: role,
          email: user.email,
          full_name: user.full_name,
        },
      ),

      this.signToken(user.user_id, this.jwtConfiguration.refreshTokenExpire),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
