import { PartialType } from '@nestjs/mapped-types';
import { CreateAppDirectoryDto } from './create-app-directory.dto';

export class UpdateAppDirectoryDto extends PartialType(CreateAppDirectoryDto) {}
