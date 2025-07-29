import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceTypeDto } from './create-service-type.dto';
import { IsOptional, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateServiceTypeDto extends PartialType(CreateServiceTypeDto) {
  @IsOptional()
  @IsInt()
  updated_by?: number;

      @IsOptional()
  @IsNumber()
  @Type(() => Number)
  location_id?: number; 
}
