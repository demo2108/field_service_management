import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-location-master.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
