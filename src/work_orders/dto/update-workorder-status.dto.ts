import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateWorkOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  workorder_id: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  updated_by?: number;
}
