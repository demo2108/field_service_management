import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class AssignEngineerDto {
  @IsInt()
  @Min(1)
  service_request_id: number;

  @IsInt()
  @Min(1)
  user_id: number;
      @IsOptional()
  @IsNumber()
  @Type(() => Number)
  location_id?: number; 
}
