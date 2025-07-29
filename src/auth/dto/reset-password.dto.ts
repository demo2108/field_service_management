import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ResetPasswordDto {
  // @IsString()
  // @IsNotEmpty()
  // token: string;
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
