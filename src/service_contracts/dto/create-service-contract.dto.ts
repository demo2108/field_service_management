import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateServiceContractDto {
  @IsInt()
  @IsNotEmpty({ message: 'Work Order ID is required' })
  work_order_id: number;

  //@IsInt()
 // @IsNotEmpty({ message: 'Service Type ID is required' })
  @IsOptional()
  @IsInt()
  service_type_id?: number;
  @IsString()
  // @IsNotEmpty()
  // contractType: string;
  @IsDateString()
  @IsNotEmpty({ message: 'Start date is required' })
  start_date: string;

  @IsDateString()
  @IsNotEmpty({ message: 'End date is required' })
  end_date: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

      
        @IsNotEmpty({ message: 'location_id is required' })
          @IsNumber()
          @Type(() => Number)
            @Min(1, { message: 'location_id must be greater than 0' })
          location_id: number;

          @IsNotEmpty({ message: 'contract_type_id is required' })
          @IsNumber()
          @Type(() => Number)
          @Min(1, { message: 'contract_type_id must be greater than 0' })
          contract_type_id: number;

           @IsOptional()  
      created_by: number;
      
        @IsOptional()
      updated_by: number;
  
      @IsOptional()
      @Type(() => Date)
      updated_at?: Date;
}