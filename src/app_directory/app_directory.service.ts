import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppDirectory } from './entities/app_directory.entity';
import { Repository } from 'typeorm';
import { CreateAppDirectoryDto } from './dto/create-app-directory.dto';
import { UpdateAppDirectoryDto } from './dto/update-app-directory.dto';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AppDirectoryService {
     constructor(
    @InjectRepository(AppDirectory)
    private readonly appDirectoryRepository: Repository<AppDirectory>,
    
  @InjectRepository(LocationMaster)
  private readonly locationRepository: Repository<LocationMaster>,
    @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  ) {}


// async create(dto: CreateAppDirectoryDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: AppDirectory | null;
// }> {
//   try {
//     let location: LocationMaster | null = null;

//     if (dto.location_id) {
//       location = await this.locationRepository.findOne({
//         where: { id: dto.location_id },
//       });

//       if (!location) {
//         return {
//           statusCode: 404,
//           message: `Location with ID ${dto.location_id} not found`,
//           data: null,
//         };
//       }
//     }
//     if (dto.created_by) {
//     let  creator = await this.appDirectoryRepository.findOne({
//         where: { id: dto.created_by },
//       });

//       if (!creator) {
//         return {
//           statusCode: 404,
//           message: `User with ID ${dto.created_by} (creator) not found.`,
//           data: null,
//         };
//       }
//     }
//     const newEntry = this.appDirectoryRepository.create({
//       ...dto,
//       ...(location ? { location } : {}),
//     });

//     const saved: AppDirectory = await this.appDirectoryRepository.save(newEntry);

//     const full = await this.appDirectoryRepository.findOne({
//       where: { id: saved.id },
//       relations: ['location'],
//     });

//     return {
//       statusCode: 201,
//       message: 'App directory entry created successfully',
//       data: full,
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       message: 'Failed to create app directory entry',
//       data: null,
//     };
//   }
// }
async create(dto: CreateAppDirectoryDto): Promise<{
  statusCode: number;
  message: string;
  data: AppDirectory | null;
}> {
  try {

     if (!dto.created_by || typeof dto.created_by !== 'number') {
      return {
        statusCode: 400,
        message: '`created_by` is required and must be a valid numeric user ID.',
        data: null,
      };
    }
    let location: LocationMaster | null = null;
    let creator: User | null = null;


    // ✅ Fetch location if provided
    if (dto.location_id) {
      location = await this.locationRepository.findOne({
        where: { id: dto.location_id },
      });


      
      if (!location) {
        return {
          statusCode: 404,
          message: `Location with ID ${dto.location_id} not found`,
          data: null,
        };
      }
    }

  

    // ✅ Fetch creator user
  if (dto.created_by) {
  creator = await this.userRepository.findOne({
    where: { id: dto.created_by },
  });

  if (!creator) {
    return {
      statusCode: 404,
      message: `User with ID ${dto.created_by} (creator) not found.`,
      data: null,
    };
  }
}


    // ✅ Fetch updator user (optional)


    // ✅ Create new AppDirectory record
    const newEntry = this.appDirectoryRepository.create({
      master_name: dto.master_name,
      field_value: dto.field_value,
      description: dto.description,
      is_active: dto.is_active ?? true,
      ...(location ? { location } : {}),
      ...(creator ? { creator } : {}),
      // ...(updator ? { updator } : {}),
    });

    const saved = await this.appDirectoryRepository.save(newEntry);

    // ✅ Return with relations: location and creator
    const full = await this.appDirectoryRepository.findOne({
      where: { id: saved.id },
      relations: ['location', 'creator'],
    });

    return {
      statusCode: 201,
      message: 'App directory entry created successfully',
      data: full,
    };
  } catch (error) {
    console.error('Create AppDirectory Error:', error);
    return {
      statusCode: 500,
      message: 'Failed to create app directory entry',
      data: null,
    };
  }
}
async update(id: number, dto: UpdateAppDirectoryDto): Promise<{
  statusCode: number;
  message: string;
  data: AppDirectory | null;
}> {
  try {


       if (!dto.updated_by || typeof dto.updated_by !== 'number') {
      return {
        statusCode: 400,
        message: '`updated_by` is required and must be a valid numeric user ID.',
        data: null,
      };
    }
    const entry = await this.appDirectoryRepository.findOne({ where: { id } });

    if (!entry) {
      return {
        statusCode: 404,
        message: `AppDirectory with ID ${id} not found`,
        data: null,
      };
    }

    // Validate updator
    let updator: User | null = null;
    if (dto.updated_by) {
      updator = await this.userRepository.findOne({
        where: { id: dto.updated_by },
      });

      if (!updator) {
        return {
          statusCode: 404,
          message: `User with ID ${dto.updated_by} (updator) not found.`,
          data: null,
        };
      }
    }

    // Validate location
    let location: LocationMaster | null = null;
    if (dto.location_id) {
      location = await this.locationRepository.findOne({
        where: { id: dto.location_id },
      });

      if (!location) {
        return {
          statusCode: 404,
          message: `Location with ID ${dto.location_id} not found`,
          data: null,
        };
      }
    }

    // Merge updates into existing entry
    const updated = this.appDirectoryRepository.merge(entry, {
      ...dto,
      ...(location ? { location } : {}),
      ...(updator ? { updator } : {}),
    });

    const saved = await this.appDirectoryRepository.save(updated);

    const full = await this.appDirectoryRepository.findOne({
      where: { id: saved.id },
      relations: ['location', 'creator', 'updator'], // include updated_by (updator)
    });

    return {
      statusCode: 200,
      message: 'App directory entry updated successfully',
      data: full,
    };
  } catch (error) {
    console.error('Update error:', error);
    return {
      statusCode: 500,
      message: 'Failed to update app directory entry',
      data: null,
    };
  }
}

// async update(id: number, dto: UpdateAppDirectoryDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: AppDirectory | null;
// }> {
//   try {
//     const entry = await this.appDirectoryRepository.findOne({ where: { id } });
//     let updator: User | null = null;
//     if (!entry) {
//       return {
//         statusCode: 404,
//         message: `AppDirectory with ID ${id} not found`,
//         data: null,
//       };
//     }
//     if (dto.updated_by) {
//       updator = await this.userRepository.findOne({
//         where: { id: dto.updated_by },
//       });

//       if (!updator) {
//         return {
//           statusCode: 404,
//           message: `User with ID ${dto.updated_by} (updator) not found.`,
//           data: null,
//         };
//       }
//     }
//     let location: LocationMaster | null = null;
//     if (dto.location_id) {
//       location = await this.locationRepository.findOne({ where: { id: dto.location_id } });

//       if (!location) {
//         return {
//           statusCode: 404,
//           message: `Location with ID ${dto.location_id} not found`,
//           data: null,
//         };
//       }
//     }

//     const updated = this.appDirectoryRepository.merge(entry, {
//       ...dto,
//       ...(location ? { location } : {}),
//       ...(updator ? { updator } : {}),
//     });

//     const saved = await this.appDirectoryRepository.save(updated);

//     const full = await this.appDirectoryRepository.findOne({
//       where: { id: saved.id },
//        relations: ['location', 'creator', 'updator'],
//     });

//     return {
//       statusCode: 200,
//       message: 'App directory entry updated successfully',
//       data: full,
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       message: 'Failed to update app directory entry',
//       data: null,
//     };
//   }
// }

// async remove(id: number): Promise<{ statusCode: number; message: string }> {
//   const entry = await this.appDirectoryRepository.findOne({ where: { id } });
//   if (!entry) {
//     throw new NotFoundException(`AppDirectory with ID ${id} not found`);
//   }

//   await this.appDirectoryRepository.delete(id);

//   return {
//     statusCode: 200,
//     message: `AppDirectory with ID ${id} deleted successfully.`,
//   };
// }
async remove(id: number): Promise<{ statusCode: number; message: string }> {
  try {
    const entry = await this.appDirectoryRepository.findOne({ where: { id } });

    if (!entry) {
      return {
        statusCode: 404,
        message: `AppDirectory with ID ${id} not found`,
      };
    }

    await this.appDirectoryRepository.delete(id);

    return {
      statusCode: 200,
      message: `AppDirectory with ID ${id} deleted successfully.`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: 'An error occurred while deleting the AppDirectory entry.',
    };
  }
}

async findAll(): Promise<{
  statusCode: number;
  message: string;
  data: AppDirectory[];
}> {
  try {
    const result = await this.appDirectoryRepository.find({
      relations: ['location'],
      order: { id: 'DESC' },
    });

    return {
      statusCode: 200,
      message: result.length > 0 ? 'AppDirectory entries retrieved successfully' : 'No entries found',
      data: result,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: 'Failed to retrieve app directory entries',
      data: [],
    };
  }
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
    records: AppDirectory[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const page = body.Page || 1;
  const limit = body.PageSize || 10;
  const skip = (page - 1) * limit;

  const query = this.appDirectoryRepository.createQueryBuilder('app')
   .leftJoinAndSelect('app.creator', 'creator')
    .leftJoinAndSelect('app.updator', 'updator');  

  // Search by master_name or field_value or description
  if (body.Search) {
    const keyword = `%${body.Search.toLowerCase()}%`;
    query.andWhere(
      `LOWER(app.master_name) LIKE :keyword OR LOWER(app.field_value) LIKE :keyword OR LOWER(app.description) LIKE :keyword`,
      { keyword }
    );
  }

  // Date filtering on created_at
  if (body.StartDate && body.EndDate) {
    const start = new Date(body.StartDate);
    const end = new Date(body.EndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: {
          records: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    query.andWhere('app.created_at BETWEEN :startDate AND :endDate', {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }

  const [records, total] = await query
    .orderBy('app.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Records found successfully.' : 'No records found.',
    data: {
      records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
async updateStatus(
  id: number,
): Promise<{
  statusCode: number;
  message: string;
  data: AppDirectory | null;
}> {
  const product = await this.appDirectoryRepository.findOne({ where: { id } });

  if (!product) {
    return {
      statusCode: 404,
      message: `Product with ID ${id} not found.`,
      data: null,
    };
  }

  // Toggle the is_active flag
  product.is_active = !product.is_active;

  const updatedProduct = await this.appDirectoryRepository.save(product);

  return {
    statusCode: 200,
    message: `app directory is now ${updatedProduct.is_active ? 'Active' : 'Inactive'}.`,
    data: updatedProduct,
  };
}
async findByFilters(
  filters: {
    id?: number;
    master_name?: string;
    field_value?: string;
    description?: string;
    is_active?: boolean;
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: {
    records: AppDirectory[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const skip = (page - 1) * limit;
  const query = this.appDirectoryRepository.createQueryBuilder('app')
     .leftJoinAndSelect('app.creator', 'creator')
    .leftJoinAndSelect('app.updator', 'updator');

  // Validate and apply ID filter
  if (filters.id !== undefined) {
    if (isNaN(filters.id)) {
      return {
        statusCode: 400,
        message: 'Invalid value for "id" filter',
        data: { records: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('app.id = :id', { id: filters.id });
  }

  // Validate and apply master_name filter
  if (filters.master_name !== undefined) {
    if (filters.master_name.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "master_name" filter',
        data: { records: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('LOWER(app.master_name) LIKE LOWER(:master_name)', {
      master_name: `%${filters.master_name.trim()}%`,
    });
  }

  // Validate and apply field_value filter
  if (filters.field_value !== undefined) {
    if (filters.field_value.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "field_value" filter',
        data: { records: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('LOWER(app.field_value) LIKE LOWER(:field_value)', {
      field_value: `%${filters.field_value.trim()}%`,
    });
  }

  // Validate and apply description filter
  if (filters.description !== undefined) {
    if (filters.description.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "description" filter',
        data: { records: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('LOWER(app.description) LIKE LOWER(:description)', {
      description: `%${filters.description.trim()}%`,
    });
  }

  // Apply is_active filter
  if (typeof filters.is_active === 'boolean') {
    query.andWhere('app.is_active = :is_active', { is_active: filters.is_active });
  }

  const [records, total] = await query
    .orderBy('app.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'AppDirectory records fetched successfully.' : 'No records found.',
    data: {
      records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}



}
