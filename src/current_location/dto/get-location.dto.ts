import { IsNumber, IsNotEmpty } from 'class-validator';

export class GetLocationDto {
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
