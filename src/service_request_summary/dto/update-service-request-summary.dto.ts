import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateServiceRequestSummaryDto {
  @IsInt({ message: 'customer_product_id must be selected' })
  customer_product_id: number;

  @IsString()
  @IsNotEmpty()
  remark: string;

  @IsBoolean()
  repair: boolean;

  @IsInt({ message: 'part_id must be selected' })
  part_id: number;
      @IsOptional()
  @IsNumber()
  @Type(() => Number)
  location_id?: number; 
}
