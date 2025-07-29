import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationMaster } from './entities/location-master.entity';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location-master.dto';
import { UpdateLocationDto } from './dto/update-location-master.dto';
import * as path from 'path';

import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; 
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocationMasterService {
     constructor(
    @InjectRepository(LocationMaster)
    private readonly locationRepo: Repository<LocationMaster>,
            @InjectRepository(User)
          private readonly userRepository: Repository<User>,
  ) {}


async create(dto: CreateLocationDto) {
  const existing = await this.locationRepo.findOne({
    where: { location_code: dto.location_code },
  });
  if (!dto.created_by || typeof dto.created_by !== 'number') {
    return {
      statusCode: 400,
      message: '`created_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }

    const creator = await this.userRepository.findOne({
    where: { id: dto.created_by },
  });

  if (!creator) {
    return {
      statusCode: 404,
      message: `User with ID ${dto.created_by} (creator) not found.`,
      data: null,
    };
  }
  if (existing) {
    return {
      statusCode: 400,
      message: `Location code '${dto.location_code}' already exists.`,
      data: null,
    };
  }

  // ✅ Handle base64 logo if present
  let logoPath: string | undefined = undefined;
  if (dto.logo && dto.logo.trim() !== '') {
    const base64Data = dto.logo.replace(/^data:image\/\w+;base64,/, '');
    const fileName = `${uuidv4()}.png`; // or use jpg based on content
    const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'logos');
    const uploadPath = path.join(uploadDir, fileName);

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save image file
    fs.writeFileSync(uploadPath, Buffer.from(base64Data, 'base64'));
    logoPath = `/uploads/logos/${fileName}`;
  }

  const location = this.locationRepo.create({
    ...dto,
    logo: logoPath ?? undefined,
    creator
  });

  const saved = await this.locationRepo.save(location);

  return {
    statusCode: 201,
    message: 'Location created successfully.',
    data: saved,
  };
}
async update(id: number, dto: UpdateLocationDto) {
  const location = await this.locationRepo.findOne({ where: { id } });
 if (!dto.updated_by || typeof dto.updated_by !== 'number') {
    return {
      statusCode: 400,
      message: '`updated_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }
    const updator = await this.userRepository.findOne({ where: { id: dto.updated_by } });
  if (!updator) {
    return {
      statusCode: 404,
      message: `User with ID ${dto.updated_by} not found`,
      data: null,
    };
  }
  if (!location) {
    return {
      statusCode: 404,
      message: 'Location not found.',
      data: null,
    };
  }

  // ✅ Handle base64 logo if present and different from existing
  let logoPath: string | undefined = location.logo;
  if (dto.logo && dto.logo.trim() !== '') {
    const base64Regex = /^data:image\/\w+;base64,/;

    if (base64Regex.test(dto.logo)) {
      const base64Data = dto.logo.replace(base64Regex, '');
      const fileName = `${uuidv4()}.png`;
      const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'logos');
      const uploadPath = path.join(uploadDir, fileName);

      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save image file
      fs.writeFileSync(uploadPath, Buffer.from(base64Data, 'base64'));
      logoPath = `/uploads/logos/${fileName}`;
    }
  }

  // ✅ Update location with new data
  Object.assign(location, dto, { logo: logoPath });

  await this.locationRepo.save(location);

  const updated = await this.locationRepo.findOne({ where: { id },relations: [ 'updator'], });

  return {
    statusCode: 200,
    message: 'Location updated successfully.',
    data: updated,
  };
}

// async update(id: number, dto: UpdateLocationDto) {
//   const location = await this.locationRepo.findOne({ where: { id } });

//   if (!location) {
//     return {
//       statusCode: 404,
//       message: 'Location not found.',
//       data: null,
//     };
//   }


  
//   Object.assign(location, dto);
  
//   await this.locationRepo.save(location);

//   const updated = await this.locationRepo.findOne({ where: { id } });

//   return {
//     statusCode: 200,
//     message: 'Location updated successfully.',
//     data: updated,
//   };
// }


  async findAll() {
    const locations = await this.locationRepo.find();
    return {
      statusCode: 200,
      message: 'Locations fetched successfully.',
      data: locations,
    };
  }
// async findAll() {
//   const locations = await this.locationRepo.find();

//   const baseUrl = 'http://localhost:3001'; // adjust for production

//   const updatedLocations = locations.map(loc => ({
//     ...loc,
//     logo: loc.logo ? `${baseUrl}${loc.logo}` : null,
//   }));

//   return {
//     statusCode: 200,
//     message: 'Locations fetched successfully.',
//     data: updatedLocations,
//   };
// }
// async findAll() {
//   const locations = await this.locationRepo.find();

//   const updatedLocations = locations.map(loc => {
//     let logoBase64: string | null = null;

//     if (loc.logo) {
//       const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'logos', path.basename(loc.logo));


//       try {
//         const fileBuffer = fs.readFileSync(filePath);
//         const ext = path.extname(filePath).substring(1); // e.g., 'png', 'jpg'
//         logoBase64 = `data:image/${ext};base64,${fileBuffer.toString('base64')}`;
//       } catch (err) {
//         console.error(`❌ Failed to read logo file for location ID ${loc.id}:`, err.message);
//       }
//     }

//     return {
//       ...loc,
//       logo: logoBase64,
//     };
//   });

//   return {
//     statusCode: 200,
//     message: 'Locations fetched successfully.',
//     data: updatedLocations,
//   };
// }
  async delete(id: number) {
    const location = await this.locationRepo.findOne({ where: { id } });

    if (!location) {
      return {
        statusCode: 404,
        message: 'Location not found.',
        data: null,
      };
    }

    await this.locationRepo.remove(location);

    return {
      statusCode: 200,
      message: 'Location deleted successfully.',
      data: location,
    };
  }
  async updateStatus(
  id: number,
): Promise<{ statusCode: number; message: string; data: LocationMaster | null }> {
  const location = await this.locationRepo.findOne({ where: { id } });

  if (!location) {
    return {
      statusCode: 404,
      message: `Location with ID ${id} not found.`,
      data: null,
    };
  }

  // Toggle is_active status
  location.is_active = !location.is_active;

  const updated = await this.locationRepo.save(location);

  return {
    statusCode: 200,
    message: `Location status updated to ${updated.is_active ? 'Active' : 'Inactive'}.`,
    data: updated,
  };
}
async searchWithPagination(body: {
  Page: number;
  PageSize: number;
  StartDate?: string;
  EndDate?: string;
  Search?: string;
}): Promise<{
  statusCode: number;
  message: string;
  data: {
    locations: LocationMaster[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const { Page, PageSize, StartDate, EndDate, Search } = body;

  const page = Page || 1;
  const limit = PageSize || 10;
  const skip = (page - 1) * limit;

  const query = this.locationRepo.createQueryBuilder('location')
       .leftJoinAndSelect('location.creator', 'creator')
    .leftJoinAndSelect('location.updator', 'updator');

  
  if (Search) {
    const keyword = `%${Search.toLowerCase()}%`;
    query.andWhere(
      `LOWER(location.name) LIKE :keyword OR LOWER(location.location_code) LIKE :keyword OR LOWER(location.address) LIKE :keyword OR LOWER(location.contact_no) LIKE :keyword`,
      { keyword },
    );
  }

  if (StartDate && EndDate) {
    const start = new Date(StartDate);
    const end = new Date(EndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: {
          locations: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    end.setHours(23, 59, 59, 999);

    query.andWhere('location.created_at BETWEEN :start AND :end', {
      start: start.toISOString(),
      end: end.toISOString(),
    });
  }

  const [locations, total] = await query
    .orderBy('location.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Locations retrieved successfully.' : 'No locations found.',
    data: {
      locations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// async findByFilters(
//   filters: {
//     id?: number;
//     name?: string;
//     location_code?: string;
//     contact_no?: string;
//     address?: string;
//     is_active?: string;
//   },
//   page: number,
//   limit: number,
// ): Promise<{
//   statusCode: number;
//   message: string;
//   data: {
//     locations: LocationMaster[];
//     total: number;
//     page: number;
//   };
// }> {
//   const query = this.locationRepo.createQueryBuilder('location');

//   // ID filter
//   if (filters.id !== undefined) {
//     query.andWhere('location.id = :id', { id: filters.id });
//   }

//   // Name filter
//   if (filters.name !== undefined) {
//     if (filters.name.trim() === '') {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "name" filter',
//         data: { locations: [], total: 0, page },
//       };
//     }
//     query.andWhere('LOWER(location.name) LIKE LOWER(:name)', {
//       name: `%${filters.name.trim()}%`,
//     });
//   }

//   // Location Code filter
//   if (filters.location_code !== undefined) {
//     if (filters.location_code.trim() === '') {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "location_code" filter',
//         data: { locations: [], total: 0, page },
//       };
//     }
//     query.andWhere('LOWER(location.location_code) LIKE LOWER(:location_code)', {
//       location_code: `%${filters.location_code.trim()}%`,
//     });
//   }

//   // Contact No filter
//   if (filters.contact_no !== undefined) {
//     if (filters.contact_no.trim() === '') {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "contact_no" filter',
//         data: { locations: [], total: 0, page },
//       };
//     }
//     query.andWhere('location.contact_no LIKE :contact_no', {
//       contact_no: `%${filters.contact_no.trim()}%`,
//     });
//   }

//   // Address filter
//   if (filters.address !== undefined) {
//     if (filters.address.trim() === '') {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "address" filter',
//         data: { locations: [], total: 0, page },
//       };
//     }
//     query.andWhere('LOWER(location.address) LIKE LOWER(:address)', {
//       address: `%${filters.address.trim()}%`,
//     });
//   }

//   // is_active filter
//   if (filters.is_active !== undefined) {
//     if (filters.is_active !== 'true' && filters.is_active !== 'false') {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "is_active" filter. Must be true or false.',
//         data: { locations: [], total: 0, page },
//       };
//     }

//     const isActiveBool = filters.is_active === 'true';
//     query.andWhere('location.is_active = :isActive', { isActive: isActiveBool });
//   }

//   const [locations, total] = await query
//     .orderBy('location.id', 'DESC')
//     .skip((page - 1) * limit)
//     .take(limit)
//     .getManyAndCount();

//   return {
//     statusCode: 200,
//     message: total > 0 ? 'Locations found successfully' : 'No locations found',
//     data: {
//       locations,
//       total,
//       page,
//     },
//   };
// }
async findByFilters(
  filters: {
    id?: number;
    name?: string;
    location_code?: string;
    contact_no?: string;
    address?: string;
    is_active?: string;
  },
  page: number,
  limit: number,
): Promise<{
  statusCode: number;
  message: string;
  data: {
    locations: LocationMaster[];
    total: number;
    page: number;
  };
}> {
  const query = this.locationRepo.createQueryBuilder('location')
     .leftJoinAndSelect('location.creator', 'creator')
    .leftJoinAndSelect('location.updator', 'updator');


  // Apply filters as before
  if (filters.id !== undefined) {
    query.andWhere('location.id = :id', { id: filters.id });
  }

  if (filters.name?.trim()) {
    query.andWhere('LOWER(location.name) LIKE LOWER(:name)', {
      name: `%${filters.name.trim()}%`,
    });
  } else if (filters.name === '') {
    return {
      statusCode: 400,
      message: 'Invalid value for "name" filter',
      data: { locations: [], total: 0, page },
    };
  }

  if (filters.location_code?.trim()) {
    query.andWhere('LOWER(location.location_code) LIKE LOWER(:location_code)', {
      location_code: `%${filters.location_code.trim()}%`,
    });
  } else if (filters.location_code === '') {
    return {
      statusCode: 400,
      message: 'Invalid value for "location_code" filter',
      data: { locations: [], total: 0, page },
    };
  }

  if (filters.contact_no?.trim()) {
    query.andWhere('location.contact_no LIKE :contact_no', {
      contact_no: `%${filters.contact_no.trim()}%`,
    });
  } else if (filters.contact_no === '') {
    return {
      statusCode: 400,
      message: 'Invalid value for "contact_no" filter',
      data: { locations: [], total: 0, page },
    };
  }

  if (filters.address?.trim()) {
    query.andWhere('LOWER(location.address) LIKE LOWER(:address)', {
      address: `%${filters.address.trim()}%`,
    });
  } else if (filters.address === '') {
    return {
      statusCode: 400,
      message: 'Invalid value for "address" filter',
      data: { locations: [], total: 0, page },
    };
  }

  if (filters.is_active !== undefined) {
    if (filters.is_active !== 'true' && filters.is_active !== 'false') {
      return {
        statusCode: 400,
        message: 'Invalid value for "is_active" filter. Must be true or false.',
        data: { locations: [], total: 0, page },
      };
    }

    const isActiveBool = filters.is_active === 'true';
    query.andWhere('location.is_active = :isActive', { isActive: isActiveBool });
  }

  const [locations, total] = await query
    .orderBy('location.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  // ✅ Convert logo to base64
const updatedLocations = locations.map(loc => {
  let logoBase64: string | null = null;

  if (loc.logo) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'uploads',
      'logos',
      path.basename(loc.logo)
    );
try {
      const fileBuffer = fs.readFileSync(filePath);
      logoBase64 = fileBuffer.toString('base64'); // ✅ remove prefix
    } catch (err) {
      console.error(`❌ Failed to read logo file for location ID ${loc.id}:`, err.message);
    }
    // try {
    //   const fileBuffer = fs.readFileSync(filePath);
    //   const ext = path.extname(filePath).substring(1); // e.g., 'png'
    //   logoBase64 = `data:image/${ext};base64,${fileBuffer.toString('base64')}`;
    // } catch (err) {
    //   console.error(`❌ Failed to read logo file for location ID ${loc.id}:`, err.message);
    // }
  }

  return {
    ...loc,
    logo: logoBase64 ?? undefined, // 🔧 fix here
  };
});


  return {
    statusCode: 200,
    message: total > 0 ? 'Locations found successfully' : 'No locations found',
    data: {
      locations: updatedLocations,
      total,
      page,
    },
  };
}
}