import { Controller, Post, Body, UnauthorizedException, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenBlacklistService } from './token-blacklist.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService,
       private readonly authService: AuthService,
        private readonly blacklistService: TokenBlacklistService
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {

const user = await this.authService.validateUser(body.email, body.password); 
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.authService.login(user); 
  }

@Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }
@Post('reset-password')
async resetPassword(@Body() body: any) {
  const { email, newPassword } = body;
  return this.authService.resetPassword(email, newPassword);
}

  // @Post('reset-password')
  // async resetPassword(@Body() body: ResetPasswordDto) {
  //   return this.authService.resetPassword(body.token, body.newPassword);
  // }  
  
}

