// dto/update-task.dto.ts
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'Engineer IDs must not be empty if provided' })
  @IsInt({ each: true })
  engineer_ids?: number[];

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
