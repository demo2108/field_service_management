import { Type } from 'class-transformer';
import { IsString, IsOptional, IsEmail, Length, MaxLength, Matches, IsNotEmpty, IsBoolean, IsNumber, Min, IsInt } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MaxLength(255)
  name: string;

@IsEmail({}, { message: 'Invalid email format' })
@IsNotEmpty({ message: 'Email is required' })
@MaxLength(255, { message: 'Email must be at most 255 characters long' })
email: string;

  @IsOptional()
  @IsString()
 @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
   @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  contact_person?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  company_code?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

  @IsNotEmpty({ message: 'location_id is required' })
  @IsNumber()
  @Type(() => Number)
    @Min(1, { message: 'location_id must be greater than 0' })
  location_id: number;

@IsOptional()
    created_by: number;
        
    @IsOptional()
    updated_by: number;
    
    @IsOptional()
    @Type(() => Date)
    updated_at?: Date;
}
