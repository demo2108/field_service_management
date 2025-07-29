import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsPositive,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class UpdatePartRequestDto {
   @IsOptional()
  @IsInt({ message: 'work_order must be an integer' })
  @Min(1, { message: 'work_order must be selected' }) 
  work_order_id?: number;

  @IsOptional()
  @IsInt()
  engineer_id?: number;

  @IsOptional()
  @IsString()
   @IsNotEmpty({ message: 'Part name is required' })
  part_name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @IsPositive({ message: 'Quantity must be greater than 0' })
  quantity?: number;

  @IsOptional()
  @IsString()
  @IsIn(['Pending', 'Approved', 'Rejected']) // Adjust based on allowed values
  request_status?: string;

  @IsOptional()
  @IsInt()
  approved_by?: number;

  @IsOptional()
  @IsDateString()
  request_date?: string;

  @IsOptional()
  @IsDateString()
  approval_date?: string;

@IsNotEmpty({ message: 'location_id is required' })
    @IsNumber()
    @Type(() => Number)
      @Min(1, { message: 'location_id must be greater than 0' })
    location_id: number;

  @IsNotEmpty({ message: 'product_id is required' })
  @IsInt({ message: 'Product ID must be a number' })
  product_id?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  is_approved?: boolean;

  @IsOptional()
  @IsString()
  image_path?: string;

  @IsOptional()
  @IsInt({ message: 'Created by must be a valid user ID' })
  created_by?: number;


  @IsNotEmpty({ message: 'updated_by is required' })
  @IsInt({ message: 'Updated by must be a valid user ID' })
  updated_by?: number;

  @IsOptional()
  @IsDateString()
  created_at?: string;

  @IsOptional()
  @IsDateString()
  updated_at?: string;
}
