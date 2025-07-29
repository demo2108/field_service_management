// // dto/update-task.dto.ts
// import { Type } from 'class-transformer';
// import {
//   IsInt,
//   IsOptional,
//   IsString,
//   IsArray,
//   ArrayNotEmpty,
//   IsNumber,
//   IsNotEmpty,
//   IsDateString,
// } from 'class-validator';

// export class UpdateTaskDto {
//   @IsOptional()
//   @IsString()
//   title?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsInt({ message: 'Service Request ID must be an integer' })
//   service_request_id: number;

//   @IsOptional()
//   @IsArray()
//   @ArrayNotEmpty({ message: 'Engineer IDs must not be empty if provided' })
//   @IsInt({ each: true })
//   engineer_ids?: number[];

//       @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   location_id?: number; 


//    @IsDateString({},{ message: 'start_date must be a valid ISO date string' })
//     start_date?: Date;
  
//     // @IsOptional()
//     @IsDateString({},{ message: 'end_date must be a valid ISO date string' })
//     end_date?: Date;
  
//     @IsOptional()
//     @IsNumber()
//     @Type(() => Number)
//     duration?: number;
  
//     // @IsOptional()
//     @IsString()
//     status?: string;
//      @IsOptional()
   
//     @IsInt({ message: 'created_by must be an integer' })
//     created_by: number;
  
//   @IsNotEmpty({ message: 'updated_by is required' })
//     @IsInt({ message: 'updated_by must be an integer' })
//     updated_by?: number;
// }
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt({ message: 'Service Request ID must be an integer' })
  service_request_id?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'Engineer IDs must not be empty if provided' })
  @IsInt({ each: true })
  engineer_ids?: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  location_id?: number;

  @IsOptional()
  @IsDateString({},{ message: 'start_date must be a valid ISO date string' })
  start_date?: Date;

  @IsOptional()
  @IsDateString({},{ message: 'end_date must be a valid ISO date string' })
  end_date?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration?: number;

  @IsOptional()
  @IsString()
  status?: string;

  // @IsOptional() // typically created_by should not be updated
  // @IsInt({ message: 'created_by must be an integer' })
  // created_by?: number;

  // @IsInt({ message: 'updated_by must be an integer' })
  // updated_by: number;

  @IsOptional()  
      created_by: number;
      
        @IsOptional()
      updated_by: number;
  
      @IsOptional()
      @Type(() => Date)
      updated_at?: Date;
}
