import { IsNumber, IsOptional, IsString, IsLatitude, IsLongitude, MinLength, IsBoolean, IsNotEmpty, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBranchDto {
  @IsNumber()
  @Type(() => Number) // helps transform string to number automatically
  customer_id: number;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Branch name must be at least 3 characters long.' })
  branch_name?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contact_number?: string;
  
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

    //  @IsOptional()

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
