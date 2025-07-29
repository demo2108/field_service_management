import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LocationService {
  async getAddressFromCoordinates(latitude: number, longitude: number): Promise<{ address: string }> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'NestJS-App', // Required by Nominatim API
      },
    });

    console.log("gittestttt");
    return { address: response.data.display_name };
  }
  
}
