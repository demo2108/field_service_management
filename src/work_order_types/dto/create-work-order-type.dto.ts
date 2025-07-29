import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateWorkOrderTypeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  type: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  capacity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  height?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  width?: string;

  @IsOptional()
  @IsInt()
  no_of_loadshell?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

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

      // @IsOptional()
@IsString()
@Matches(/^\d{1,3}:[0-5][0-9]$/, {
  message: 'sla must be in HH:mm format (e.g., 04:45)',
})
sla?: string;

}
