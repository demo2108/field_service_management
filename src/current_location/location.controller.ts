import { Controller, Post, Body } from '@nestjs/common';
import { LocationService } from './location.service';
import { GetLocationDto } from './dto/get-location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('address')
  async getAddress(@Body() dto: GetLocationDto) {
    return this.locationService.getAddressFromCoordinates(dto.latitude, dto.longitude);
  }
}
