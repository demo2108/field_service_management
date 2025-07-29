import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
    @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
