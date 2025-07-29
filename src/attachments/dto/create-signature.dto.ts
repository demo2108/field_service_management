import { IsNotEmpty, IsArray } from 'class-validator';

export class CreateSignatureDto {
  @IsNotEmpty()
  work_order_id: number;

  @IsNotEmpty()
  service_request_id: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  base64_images: string[];

  remarks?: string;
  document_name?: string;
  document_number?: string;
  location_id?: number;
  uploaded_by?: number;
  created_by?: number;
}
