import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, IsBoolean, IsInt, IsNumber } from 'class-validator';

export class CreateServiceTypeDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  created_by?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

      @IsOptional()
  @IsNumber()
  @Type(() => Number)
  location_id?: number; 
 
      
        @IsOptional()
      updated_by: number;
  
      @IsOptional()
      @Type(() => Date)
      updated_at?: Date;
}
