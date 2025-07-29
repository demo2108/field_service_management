
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt({ message: 'Work order ID must be an integer' })
  work_order_id: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Engineer IDs must not be empty' })
  @IsInt({ each: true, message: 'Each engineer ID must be an integer' })
  engineer_ids: number[];
  
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
