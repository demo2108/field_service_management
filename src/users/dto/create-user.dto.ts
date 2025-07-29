
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, Length, Matches, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

   @IsOptional()
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  phone?: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  // @IsNotEmpty({ message: 'Role ID is required' })
  // @Matches(/^\d+$/, { message: 'invalid input Role ID' })
  // roleId?: string;
  @IsNotEmpty({ message: 'Role ID is required' })
@IsInt({ message: 'Role ID must be an integer' })
roleId: number;

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
