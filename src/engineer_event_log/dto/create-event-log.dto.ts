// import { IsDate, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
// import { Type } from 'class-transformer';

// export class CreateEventLogDto {
//   @IsOptional()
//   @IsString()
//   event_name?: string;

//   @IsNumber()
//   work_order_id: number;

//   @IsNumber()
//   service_request_id: number;

//   @IsNumber()
//   @Min(-90)
//   @Max(90)
//   latitude: number;

//   @IsNumber()
//   @Min(-180)
//   @Max(180)
//   longitude: number;

//   @Type(() => Date)
//   @IsDate()
//   location_time: Date;

//   @IsString()
//   status: string;

//   @IsString()
//   reason: string;

//   @IsNumber()
//   changed_by: number;

//   @IsOptional()
//   @Type(() => Date)
//   @IsDate()
//   existing_date?: Date;

//   @IsOptional()
//   @Type(() => Date)
//   @IsDate()
//   extending_date?: Date;

//   @IsNumber()
//   user_id: number;

//     @IsOptional()
//   @Type(() => Date)
//   @IsDate()
//   entry_time?: Date;

//   @IsOptional()
//   @Type(() => Date)
//   @IsDate()
//   exit_time?: Date;
// }

import { IsDate, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventLogDto {
  @IsOptional()
  @IsString()
  event_name?: string;

  @IsNumber()
  work_order_id: number;

  @IsNumber()
  service_request_id: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  location_time?: Date;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsNumber()
  changed_by?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  existing_date?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  extending_date?: Date;

  @IsNumber()
  user_id: number;

    @IsNumber()
  work_order_task_id: number;

@IsNumber()
  service_request_task_id: number;

   @IsNumber()
  attachment_id: number;
    @IsNumber()
  product_id: number;
  @IsNumber()
  service_contract_id: number;
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  entry_time?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  exit_time?: Date;
}