
// // import {
// //   IsInt,
// //   IsNotEmpty,
// //   IsOptional,
// //   IsString,
// //   IsDateString,
// //   MaxLength,
// //   Min,
// //   Matches,
// //   Length,
// // } from 'class-validator';

// // export class CreateWorkOrderDto {
// //    @IsInt({ message: 'Customer ID must be an integer' })
// //   @Min(1, { message: 'Customer ID must be greater than 0' })
// //   customer_id: number;

// //   @IsInt({ message: 'Branch ID must be an integer' })
// //   @Min(1, { message: 'Branch ID must be greater than 0' })
// //   branch_id: number;

// //   @IsString()
// //   @IsNotEmpty({ message: 'Priority is required' })
// //   @MaxLength(50)
// //   priority: string;

// //   @IsOptional()
// //   workOrderID?: string;

// //    @IsOptional()
// //   @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
// //   @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
// //   contact_person_no?: string;

// //   @IsString()
// //   @IsNotEmpty({ message: 'Status is required' })
// //   @MaxLength(50)
// //   status: string;

// //   @IsOptional()
// //   @IsString()
// //   hold_reason?: string;

// //   @IsOptional()
// //   @IsString()
// //   description?: string;

// //   @IsOptional()
// //   @IsString()
// //   for?: string;

// //   @IsOptional()
// //   @IsString()
// //   contact_person?: string;

// //   @IsOptional()
// //   @IsDateString({}, { message: 'Target completion date must be a valid ISO date (YYYY-MM-DD)' })
// //   target_completion_date?: string;

// //   @IsOptional()
// //   @IsInt({ message: 'Created by must be an integer' })
// //   created_by?: number;
// // }

// import {
//   IsInt,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   IsDateString,
//   MaxLength,
//   Min,
//   Matches,
//   Length,
//   IsArray,
//   ArrayNotEmpty,
//   ValidateNested,
// } from 'class-validator';
// import { CreateTaskDto } from './task.dto';
// import { Type } from 'class-transformer';

// export class CreateWorkOrderDto {
//   @IsInt({ message: 'Customer ID must be an integer' })
//   @Min(1, { message: 'Customer ID must be greater than 0' })
//   customer_id: number;

//   @IsInt({ message: 'Branch ID must be an integer' })
//   @Min(1, { message: 'Branch ID must be greater than 0' })
//   branch_id: number;

//   @IsString()
//   @IsNotEmpty({ message: 'Priority is required' })
//   @MaxLength(50)
//   priority: string;

//   @IsString()
//   @IsNotEmpty({ message: 'Status is required' })
//   @MaxLength(50)
//   status: string;

//   @IsOptional()
//   @IsString()
//   @MaxLength(50)
//   workorder_id?: string; // renamed from workOrderID

//   @IsOptional()
//   @IsString()
//   @MaxLength(50)
//   workorder_req_assignid?: string;

//  @IsNotEmpty({ message: 'Contact person number is required' })
//   @IsString({ message: 'Contact person number must be a string' })
//   contact_person_no?: string;

//   @IsNotEmpty({ message: 'Contact person name is required' })
//   @IsString({ message: 'Contact person name must be a string' })
//   contact_person?: string;
//   @IsOptional()
//   @IsString()
//   hold_reason?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsString()
//   for?: string;

//   @IsNotEmpty()
//   @IsDateString({}, { message: 'Target completion date must be a valid ISO date (YYYY-MM-DD)' })
//   target_completion_date?: string;

//   @IsNotEmpty({ message: 'Created by is required' })
//   @IsInt({ message: 'Created by must be an integer' })
//   created_by?: number;


//   @IsOptional()
//   @IsArray()
//   @ArrayNotEmpty({ message: 'At least one engineer must be provided if assigning' })
//   @IsInt({ each: true, message: 'Each engineer ID must be an integer' })
//   user_ids?: number[];

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateTaskDto)
//   tasks?: CreateTaskDto[];
//   // @IsArray()
//   // @ArrayNotEmpty()
//   // tasks: {
//   //   title: string;
//   //   description?: string;
//   //   engineer_ids: number[];
//   // }[];
// }
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
  Min,
  Matches,
  Length,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTaskDto } from './task.dto';

export class CreateWorkOrderDto {
  @IsInt({ message: 'Customer ID must be an integer' })
  @Min(1, { message: 'Customer ID must be greater than 0' })
  customer_id: number;

  @IsInt({ message: 'Branch ID must be an integer' })
  @Min(1, { message: 'Branch ID must be greater than 0' })
  branch_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Priority is required' })
  @MaxLength(50)
  priority: string;

  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  @MaxLength(50)
  status: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  workorder_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  workorder_req_assignid?: string;

  @IsNotEmpty({ message: 'Contact person number is required' })
  @IsString({ message: 'Contact person number must be a string' })
  contact_person_no?: string;

  @IsNotEmpty({ message: 'Contact person name is required' })
  @IsString({ message: 'Contact person name must be a string' })
  contact_person?: string;

  @IsOptional()
  @IsString()
  hold_reason?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  for?: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'Target completion date must be a valid ISO date (YYYY-MM-DD)' })
  target_completion_date?: string;

  @IsNotEmpty({ message: 'Created by is required' })
  @IsInt({ message: 'Created by must be an integer' })
  created_by?: number;

  @IsOptional()
  @IsInt({ message: 'Work Order Type ID must be an integer' })
  work_order_type_id?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one engineer must be provided if assigning' })
  @IsInt({ each: true, message: 'Each engineer ID must be an integer' })
  user_ids?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks?: CreateTaskDto[];

    @IsOptional()
  @IsBoolean()
  is_active?: boolean;
     @IsOptional()
  @IsInt({ message: 'no_of_items must be an integer' })
  no_of_items?: number;
  
   @IsNotEmpty({ message: 'location_id is required' })
         @IsNumber()
         @Type(() => Number)
           @Min(1, { message: 'location_id must be greater than 0' })
         location_id: number;

     
        @IsOptional()
      updated_by: number;
  
      @IsOptional()
      @Type(() => Date)
      updated_at?: Date;
}

