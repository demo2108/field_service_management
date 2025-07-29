import { IsOptional, IsString, IsInt } from 'class-validator';

export class SearchServiceRequestDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsInt()
  sequence?: number;

  @IsOptional()
  @IsInt()
  location_id?: number;
}
