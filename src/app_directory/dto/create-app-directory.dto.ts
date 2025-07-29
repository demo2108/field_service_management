import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsInt } from 'class-validator';

export class CreateAppDirectoryDto {
  @IsString()
  @IsNotEmpty({ message: 'master_name is required' })
  master_name: string;

  @IsString()
  @IsNotEmpty({ message: 'field_value is required' })
  field_value: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  location_id?: number; 

  
    @IsInt()  
    created_by: number;
    
      @IsOptional()
    updated_by: number;

    @IsOptional()
    @Type(() => Date)
    updated_at?: Date;

}
