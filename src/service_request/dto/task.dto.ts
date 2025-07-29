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
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt({ message: 'Service Request ID must be an integer' })
  service_request_id: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'Engineer IDs must not be empty' })
  @IsInt({ each: true, message: 'Each engineer ID must be an integer' })
  engineer_ids: number[];

   @IsNotEmpty({ message: 'location_id is required' })
   @IsNumber()
   @Type(() => Number)
   @Min(1, { message: 'location_id must be greater than 0' })
   location_id: number;
//  @IsOptional()
  @IsDateString({},{ message: 'start_date must be a valid ISO date string' })
  start_date?: Date;

  // @IsOptional()
  @IsDateString({},{ message: 'end_date must be a valid ISO date string' })
  end_date?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration?: number;

  // @IsOptional()
  @IsString()
  status?: string;

  // @IsNotEmpty({ message: 'created_by is required' })
  // @IsInt({ message: 'created_by must be an integer' })
  // created_by: number;

  // @IsOptional()
  // @IsInt({ message: 'updated_by must be an integer' })
  // updated_by?: number;


    @IsOptional()  
      created_by: number;
      
        @IsOptional()
      updated_by: number;
  
      @IsOptional()
      @Type(() => Date)
      updated_at?: Date;

}

