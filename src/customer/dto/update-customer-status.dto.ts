import { IsBoolean } from 'class-validator';

export class UpdateCustomerStatusDto {
  @IsBoolean()
  is_active: boolean;
}
