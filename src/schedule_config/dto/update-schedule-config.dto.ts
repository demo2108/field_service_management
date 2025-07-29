import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleConfigDto } from './create-schedule-config.dto';

export class UpdateScheduleConfigDto extends PartialType(CreateScheduleConfigDto) {}
