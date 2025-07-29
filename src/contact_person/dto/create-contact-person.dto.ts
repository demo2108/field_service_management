import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, Length, IsPhoneNumber, IsInt, Matches, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateContactPersonDto {
  @IsInt()
  @IsNotEmpty()
  branchId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsEmail()
  @Length(1, 255,{ message: 'Invalid email format' })
  email: string;

  @IsString()
@Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  phone: string;

  @IsString()
  @Length(1, 100)
  designation: string
  

  @IsNotEmpty({ message: 'location_id is required' })
  @IsNumber()
  @Type(() => Number)
    @Min(1, { message: 'location_id must be greater than 0' })
  location_id: number;

    @IsInt()  
      created_by: number;
      
        @IsOptional()
      updated_by: number;
  
      @IsOptional()
      @Type(() => Date)
      updated_at?: Date;
}
