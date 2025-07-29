import { Type } from 'class-transformer';
import {  IsString,  IsNotEmpty,  IsOptional,  IsBoolean,  IsDateString,  IsArray,  IsInt,  ArrayNotEmpty, IsNumber, Min,} from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsInt()
  type_id?: number;

  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Model number is required' })
  model_number: string;
  // @IsString()
  // @IsNotEmpty({ message: 'serial no number is required' })
  // serial_no: string;

  @IsOptional()
  @IsDateString({}, { message: 'Expiry date must be a valid date string (YYYY-MM-DD)' })
  expiry_date?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;  
  
  @IsNotEmpty({ message: 'is_product is required' })
  @IsBoolean({ message: 'is_product must be a boolean value' })
  is_product: boolean;
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


   @IsString()
  @IsNotEmpty({ message: 'make  is required' })
  make: string;


   @IsString()
  @IsNotEmpty({ message: 'contract_type  is required' })
  contract_type: string;

     @IsString()
  @IsNotEmpty({ message: 'duration  is required' })
  duration: string;

  @IsOptional()
  unit: string;


       @IsString()
  @IsNotEmpty({ message: 'product_code  is required' })
  product_code: string;


  
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