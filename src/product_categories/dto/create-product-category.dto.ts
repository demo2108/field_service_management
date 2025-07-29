import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
// @IsNotEmpty({ message: 'club_code is required' })
  @MaxLength(50)
  club_code?: string;

  @IsOptional()
@IsBoolean()
is_active?: boolean;


  @IsOptional()
  @IsString()
  description?: string;

       @IsNotEmpty({ message: 'location_id is required' })
         @IsNumber()
         @Type(() => Number)
           @Min(1, { message: 'location_id must be greater than 0' })
         location_id: number;

          @IsOptional()  
      created_by: number;
      
        @IsOptional()
      updated_by: number;
  
      @IsOptional()
      @Type(() => Date)
      updated_at?: Date;
}
