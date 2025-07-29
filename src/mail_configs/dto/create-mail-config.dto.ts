import { IsOptional, IsString, IsInt, IsEmail } from 'class-validator';

export class CreateMailConfigDto {
  @IsOptional()
  @IsString()
  mail_driver?: string;

  @IsOptional()
  @IsString()
  mail_host?: string;

  @IsOptional()
  @IsInt()
  mail_port?: number;

  @IsOptional()
  @IsString()
  mail_username?: string;

  @IsOptional()
  @IsString()
  mail_password?: string;

  @IsOptional()
  @IsEmail()
  mail_address?: string;

  @IsOptional()
  @IsString()
  mail_encryption?: string;

  @IsOptional()
  @IsString()
  mail_active?: string;

  @IsString()
  mail_name: string;
}
