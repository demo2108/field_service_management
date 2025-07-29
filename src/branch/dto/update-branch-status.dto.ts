import { IsBoolean } from 'class-validator';

export class UpdateBranchStatusDto {
  @IsBoolean()
  is_active: boolean;
}
