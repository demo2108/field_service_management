// import { PartialType } from '@nestjs/mapped-types';
// import { CreateContactPersonDto } from './create-contact-person.dto';

// export class UpdateContactPersonDto extends PartialType(CreateContactPersonDto) {}
 import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateContactPersonDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  branchId: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  designation: string;

   @IsNotEmpty({ message: 'location_id is required' })
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'location_id must be greater than 0' }) // ✅
  location_id: number;
  
  @IsOptional()
        created_by: number;
            @IsInt()  
        updated_by: number;
    
        @IsOptional()
        @Type(() => Date)
        updated_at?: Date;
}
