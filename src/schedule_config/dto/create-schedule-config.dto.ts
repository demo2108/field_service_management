import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateScheduleConfigDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  schedule_type: string;

  @IsString()

  step: string;

  @IsEmail()
  @MaxLength(150)
  mail_to: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  mail_subject?: string;

  @IsOptional()
  @IsString()
  mail_body?: string;

  @IsOptional()
  @IsInt()
  created_by?: number;

  @IsOptional()
  @IsInt()
  updated_by?: number;
}
