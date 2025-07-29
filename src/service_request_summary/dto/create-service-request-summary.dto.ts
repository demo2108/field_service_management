import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  Min,
  IsNumber,
} from 'class-validator';

export class CreateServiceRequestSummaryDto {
  @IsInt({ message: 'Customer product  must be an integer' })
  @IsNotEmpty({ message: 'Customer product  is required' })
    @Min(1, { message: 'Customer product must be selected' }) 
  customer_product_id: number;
 

  @IsOptional()
  @IsString({ message: 'Remark must be a string' })
  remark?: string;

  @IsOptional()
  @IsBoolean({ message: 'Repair must be a boolean value' })
  repair?: boolean;

  @IsOptional()
  @IsInt({ message: 'Part  must be an integer' })
   @IsNotEmpty({ message: 'Part is required' })
    @Min(1, { message: 'Part must be selected' }) 
  part_id?: number;

      @IsOptional()
  @IsNumber()
  @Type(() => Number)
  location_id?: number; 
}
