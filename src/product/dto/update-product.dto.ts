// import { PartialType } from '@nestjs/mapped-types';
// import { CreateProductDto } from './create-product.dto';

// export class UpdateProductDto extends PartialType(CreateProductDto) {}
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
  IsInt,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsInt()
  type_id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  model_number?: string;


  @IsOptional()
  @IsDateString({}, { message: 'Expiry date must be a valid date string (YYYY-MM-DD)' })
  expiry_date?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsInt()
  replacement_of?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  club_code?: string[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'Each work_order_type must be an integer' })
  work_order_type?: number[];

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  contract_type?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  product_code?: string;
  
  @IsNotEmpty({ message: 'is_product is required' })
  @IsBoolean({ message: 'is_product must be a boolean value' })
  is_product: boolean;
  // ✅ Make location_id optional for update (but validated if present)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'location_id must be greater than 0' })
  location_id?: number;

    @IsOptional()
  unit: string;
}
