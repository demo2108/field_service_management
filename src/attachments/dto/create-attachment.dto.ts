import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  Min,
  IsInt,
  isInt,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

// export class CreateAttachmentDto {

//  @IsNotEmpty({ message: 'base64_files is required' })
//    @IsString({ each: true })
//   @IsArray({ message: 'base64_files must be an array' })
//   @ArrayNotEmpty({ message: 'base64_files cannot be empty' })
//   @IsString({ each: true, message: 'each value in base64_files must be a string' })
//   base64_files: string[];
//   @IsOptional()
//   @IsString()
//   document_name?: string;

//   @IsOptional()
//   @IsString()
//   document_number?: string;

//   @IsOptional()
//   @IsString()
//   remarks?: string;

//   @IsOptional()
//   file_type: string;

//   @IsOptional()
//   uploaded_by?: number;

//   @IsOptional()
//   work_order_id?: number;


//  @IsNotEmpty({ message: 'service_request_id is required' })
// @IsInt({ message: 'service_request_id must be an integer' })
// service_request_id: number;


//   @IsOptional()
//   @IsString()
//   file_url?: string;

//   @IsNotEmpty({ message: 'base64_file is required' })
//   @IsString()
//   base64_file: string;

//   @IsNotEmpty({ message: 'location_id is required' })
//   @IsNumber()
//   @Type(() => Number)
//   @Min(1, { message: 'location_id must be greater than 0' })
//   location_id: number;

//   @IsInt({ message: 'created_by must be an integer' })
//   created_by: number;

//   @IsOptional()
//   updated_by: number;

//   @IsOptional()
//   @Type(() => Date)
//   updated_at?: Date;
// }
export class CreateAttachmentDto {
  @IsNotEmpty({ message: 'base64_files is required' })
  @IsArray({ message: 'base64_files must be an array' })
  @ArrayNotEmpty({ message: 'base64_files cannot be empty' })
  @IsString({ each: true, message: 'each value in base64_files must be a string' })
  base64_files: string[];

  @IsOptional()
  @IsString()
  document_name?: string;

  @IsOptional()
  @IsString()
  document_number?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  file_type: string;

  @IsOptional()
  uploaded_by?: number;

  @IsOptional()
  work_order_id?: number;

  @IsNotEmpty({ message: 'service_request_id is required' })
  @IsInt({ message: 'service_request_id must be an integer' })
  service_request_id: number;

  @IsOptional()
  // @IsString()
  file_url?: string;

  @IsNotEmpty({ message: 'location_id is required' })
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'location_id must be greater than 0' })
  location_id: number;

  @IsInt({ message: 'created_by must be an integer' })
  created_by: number;

  @IsOptional()
  updated_by?: number;

  @IsOptional()
  @Type(() => Date)
  updated_at?: Date;
}
