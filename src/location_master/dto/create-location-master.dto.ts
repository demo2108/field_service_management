import { Type } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(50)
  location_code: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contact_no?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  logo?: string; // You can also use MultipartFile if uploading logo as file


  @IsOptional()
  @IsString()
  email?: string; // You can also use MultipartFile if uploading logo as file
  @IsOptional()
  @IsString()
  website_name?: string; // You can also use MultipartFile if uploading logo as file

   @IsOptional()  
        created_by: number;
        
          @IsOptional()
        updated_by: number;
    
        @IsOptional()
        @Type(() => Date)
        updated_at?: Date;
}
