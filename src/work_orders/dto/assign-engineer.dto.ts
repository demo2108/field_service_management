import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class AssignEngineerDto {
  @IsInt()
  @Min(1)
  work_order_id: number;

  @IsInt()
  @Min(1)
  user_id: number;
    
    @IsNotEmpty({ message: 'location_id is required' })
           @IsNumber()
           @Type(() => Number)
             @Min(1, { message: 'location_id must be greater than 0' })
           location_id: number;

  
}
