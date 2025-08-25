import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SignInProvider } from './signin.provider';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { PassHashingModule } from 'src/pass-hashing/pass-hashing.module';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SignInProvider,
    GenerateTokensProvider,
    RefreshTokensProvider,
  ],
  exports: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    PassHashingModule,
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forRoot({
      envFilePath: '.env.jwt',
      isGlobal: true,
    }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class AuthModule {}
