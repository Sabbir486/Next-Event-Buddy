import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { Event } from './event/entities/event.entity';
import { Booking } from './booking/entities/booking.entity';
import { Role } from './role/entities/role.entity';
import { User } from './user/entities/user.entity';
import { PassHashingModule } from './pass-hashing/pass-hashing.module';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { RolesGuard } from './auth/guards/roles/roles.guard';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.db'],
    }),

    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
        MulterModule.register({
          dest: './uploads',
        }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Event, Booking, Role, User],
        synchronize: true,
      }),
    }),

    BookingModule,

    UserModule,

    RoleModule,

    EventModule,

    PassHashingModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
