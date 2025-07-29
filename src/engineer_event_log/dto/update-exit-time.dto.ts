// src/engineer_event_log/dto/update-exit-time.dto.ts
import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateExitTimeDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  exit_time: Date;
}
