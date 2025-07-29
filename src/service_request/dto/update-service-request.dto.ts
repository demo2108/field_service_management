// update-service-request.dto.ts
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  IsString,
  IsBoolean,
  IsDateString,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';

export class UpdateServiceRequestDto {
  @IsOptional()
  @IsInt()
  work_order_id?: number;

  // @IsOptional()
  // @IsInt()
  // service_name_id?: number;
 @IsNotEmpty()
  @Type(() => Number)
  @IsInt({ message: 'app_dir_id must be an integer' })
  @Min(1, { message: 'app_dir_id must be greater than 0' })
  app_dir_id?: number;
// @IsOptional()
// @IsArray()
// @IsInt({ each: true })
// engineer_ids?: number[];
@IsOptional()
@IsArray()
@ArrayNotEmpty()
engineer_ids?: number[];


  // @IsOptional()
  // @IsInt()
  // created_by?: number;


  @IsNotEmpty({ message: 'Updated by is required' })
  @Type(() => Number)
  @IsInt({ message: 'updated_by must be an integer number' })
  updated_by: number;

  @IsOptional()
  @IsBoolean()
  acknowledged?: boolean;

  @IsOptional()
  @IsDateString()
  acknowledged_at?: string;

  @IsOptional()
  @IsString()
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
  @Type(() => Boolean)
  @IsBoolean({ message: 'wo_flag must be a boolean value' })
  wo_flag?: boolean;


  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsInt()
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
  @Type(() => Number)
  @IsNumber({}, { message: 'location_id must be a number conforming to the specified constraints' })
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
