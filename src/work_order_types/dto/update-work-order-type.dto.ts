import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkOrderTypeDto } from './create-work-order-type.dto';

export class UpdateWorkOrderTypeDto extends PartialType(CreateWorkOrderTypeDto) {}
