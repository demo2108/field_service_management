// dto/search-event-log.dto.ts

import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchEventLogDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  work_order_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  service_request_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  location_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  attachment_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  product_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  service_contract_id?: number;
}
