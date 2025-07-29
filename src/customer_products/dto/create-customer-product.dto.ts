import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';


export class CreateCustomerProductDto {
  @IsInt()
    @IsOptional()
  @Min(1, { message: 'Customer ID must be greater than 0' })
  customer_id: number;

  @IsInt()
  @Min(1, { message: 'Product ID must be greater than 0' })
  product_id: number;

  @IsOptional()
  @IsDateString()
  delivery_date?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Installed by must be greater than 0 if provided' })
  installed_by?: number;

  @IsOptional()
  @IsDateString()
  expiry_date?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  serial_no?: string;  

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Work order ID must be greater than 0 if provided' })
  work_order_id?: number;

  @IsOptional()
  @IsDateString()
  is_active_date?: string;

  @IsOptional()
  @IsInt({ message: 'no_of_items must be an integer' })
  no_of_items?: number;



  @IsNotEmpty({ message: 'location_id is required' })
  @IsInt({ message: 'location_id must be an integer' })
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
