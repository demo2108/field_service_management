import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { TokenBlacklistService } from './token-blacklist.service';

@Module({
 imports: [
  ConfigModule.forRoot({ isGlobal: true }), 


  PassportModule,
  JwtModule.registerAsync({
    imports: [ConfigModule, forwardRef(() => UsersModule),],
    useFactory: async (configService: ConfigService) => ({
  //  secret: process.env.JWT_SECRET || 'myStrongSecretKey',
  secret: configService.get('JWT_SECRET') || 'myStrongSecretKey',

      // signOptions: { expiresIn: '1h' },
    }),
    inject: [ConfigService],
  }), 
   forwardRef(() => UsersModule),
],


  providers: [AuthService, JwtStrategy,TokenBlacklistService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
