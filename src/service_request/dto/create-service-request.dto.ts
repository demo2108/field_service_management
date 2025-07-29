import { Type } from 'class-transformer';
import {  IsBoolean,  IsDateString,  IsEnum,  IsInt,  IsNotEmpty,  IsOptional,  IsString,  IsNumber,  MaxLength, IsArray, ArrayNotEmpty, Min,} from 'class-validator';

export class CreateServiceRequestDto {
 @IsInt()
  @IsNotEmpty()
  work_order_id: number;

  // @IsInt()
  // @IsNotEmpty()
  // service_name_id: number;

  @IsNotEmpty()
  @IsInt({ message: 'app_dir_id must be an integer' })
  @Min(1, { message: 'app_dir_id must be greater than 0' })
  app_dir_id?: number;


@IsArray()
@ArrayNotEmpty()
@IsInt({ each: true })
engineer_ids: number[];

  @IsInt()
  @IsNotEmpty({ message: 'Created by is required' })
  created_by: number;

 

  @IsOptional()
  @IsBoolean()
  acknowledged?: boolean;

  @IsOptional()
  @IsDateString()
  acknowledged_at?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsString()
  unavailability_reason?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;


  @IsBoolean()
  wo_flag?: boolean;


  @IsOptional()
  @IsString()
  @MaxLength(50)
  priority?: string;

  @IsOptional()
  @IsNumber()
  sequence?: number;

  @IsOptional()
  @IsString()
  customer_feedback?: string;

  @IsOptional()
  @IsString()
  customer_signature_path?: string;
 
  @IsOptional()
  @IsDateString()
  target_completion_date?: Date;

  @IsOptional()
  @IsDateString()
  starting_date?: Date;

   @IsNotEmpty({ message: 'location_id is required' })
   @IsNumber()
   @Type(() => Number)
   @Min(1, { message: 'location_id must be greater than 0' })
   location_id: number;
 
@IsOptional()
  @IsString()
  @MaxLength(50)
  service_request_num?: string;

   @IsOptional()
  @IsString()
  @MaxLength(50)
  progress?: string;


    @IsOptional()
  @IsInt({ message: 'customer_id must be an integer' })
  @Min(1, { message: 'customer_id must be greater than 0' })
  customer_id?: number;

  @IsOptional()
  @IsInt({ message: 'branch_id must be an integer' })
  @Min(1, { message: 'branch_id must be greater than 0' })
  branch_id?: number;

  @IsOptional()
  @IsInt({ message: 'work_order_type_id must be an integer' })
  @Min(1, { message: 'work_order_type_id must be greater than 0' })
  work_order_type_id?: number;

  @IsOptional()
  @IsBoolean()
  charge?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  contact_person_no?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  contact_person?: string;
}
