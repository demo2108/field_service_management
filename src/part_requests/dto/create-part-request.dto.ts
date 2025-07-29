import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  IsDateString,
  IsIn,
  Min,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreatePartRequestDto {
  @IsOptional()
  @IsInt({ message: 'work_order must be an integer' })
  @Min(1, { message: 'work_order must be selected' }) 
  work_order_id?: number;

  @IsOptional()
  @IsInt()
  engineer_id?: number;

  @IsString()
  @IsNotEmpty({ message: 'Part name is required' })
  @MaxLength(255)
  part_name: string;

  @IsInt()
  @IsPositive({ message: 'Quantity must be greater than 0' })
  quantity: number;

  @IsOptional()
  @IsString()
  @IsIn(['Pending', 'Approved', 'Rejected'])
  request_status?: string;

  @IsOptional()
  @IsInt()
  approved_by?: number;

  @IsOptional()
  @IsDateString()
  request_date?: string;

  @IsOptional()
  @IsDateString()
  approval_date?: string;

  //     @IsOptional()
  // @IsNumber()
  // @Type(() => Number)
  // location_id?: number; 

    @IsNotEmpty({ message: 'location_id is required' })
    @IsNumber()
    @Type(() => Number)
      @Min(1, { message: 'location_id must be greater than 0' })
    location_id: number;

  @IsNotEmpty({ message: 'product_id is required' })
  @IsInt({ message: 'Product ID must be a number' })


   // @Column({ nullable: true })
    product_id: number;
    // @ManyToOne(() => Product)
    // @JoinColumn({ name: 'product_id' })
    // product: Product;


  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  is_approved?: boolean;

  @IsOptional()
  @IsString()
  image_path?: string;

  @IsOptional()
@IsString()
base64_image?: string;
// @IsNotEmpty({ message: 'created_by is required' })
//   @IsInt({ message: 'Created by must be a valid user ID' })
//   created_by?: number;

//   @IsOptional()
//   @IsInt({ message: 'Updated by must be a valid user ID' })
//   updated_by?: number;

  @IsOptional()
  @IsDateString()
  created_at?: string;

  // @IsOptional()
  // @IsDateString()
  // updated_at?: string;

   @IsOptional()  
      created_by: number;
      
        @IsOptional()
      updated_by: number;
  
      @IsOptional()
      @Type(() => Date)
      updated_at?: Date;
  

}
