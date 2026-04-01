import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_CONFIG } from 'src/common/types/type-orm';
import { userProviders } from '../usuarios/providers/user-typeorm.provider';
import { DatabaseModule } from 'src/config/database/database.module';
import { LocalStrategy } from './strategy/local-strategy.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/auth-jwt-strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get(JWT_CONFIG.SECRET),
        signOptions: { expiresIn: config.get(JWT_CONFIG.EXPIRE) },
      }),
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ...userProviders, LocalStrategy, JwtStrategy],
})
export class AuthModule { }
