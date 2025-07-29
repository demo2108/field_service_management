import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { Not, Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProductCategoriesService {
     constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(LocationMaster)
    private readonly locationRepository: Repository<LocationMaster>,
     @InjectRepository(User)
          private readonly userRepository: Repository<User>,
  ) {}
// async create(dto: CreateProductCategoryDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: ProductCategory;
// }> {
//   const category = this.productCategoryRepository.create(dto);
//   const savedCategory = await this.productCategoryRepository.save(category);

//   return {
//     statusCode: 201,
//     message: 'Product category created successfully.',
//     data: savedCategory,
//   };
// }



async create(dto: CreateProductCategoryDto): Promise<{
  statusCode: number;
  message: string;
  data: ProductCategory | null;
}> {
  const location = await this.locationRepository.findOne({
    where: { id: dto.location_id },
  });

  
  if (!dto.created_by || typeof dto.created_by !== 'number') {
    return {
      statusCode: 400,
      message: '`created_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }
  if (!location) {
    return {
      statusCode: 404,
      message: `Location with ID ${dto.location_id} not found.`,
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

  const existingCategory = await this.productCategoryRepository.findOne({
    where: {
      name: dto.name,
      location: { id: dto.location_id }, // optional: restrict duplicates per location
    },
    relations: ['location'],
  });

  if (existingCategory) {
    return {
      statusCode: 409, // Conflict
      message: `Product category with name '${dto.name}' already exists.`,
      data: null,
    };
  }

  const category = this.productCategoryRepository.create({
    ...dto,
    location,
    creator,
  });

  // const savedCategory = await this.productCategoryRepository.save(category);
  const savedCategory = await this.productCategoryRepository.save(category);

  // Reload to include full creator (user) details
  const finalCategory = await this.productCategoryRepository.findOne({
    where: { id: savedCategory.id },
    relations: ['location', 'creator'], // ensure this matches your entity
  });
  return {
    statusCode: 201,
    message: 'Product category created successfully.',
    data: finalCategory,
  };
}


  async findAll(page = 1): Promise<{
  statusCode: number;
  message: string;
  data: {
    categories: ProductCategory[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const take = 10;
  const skip = (page - 1) * take;

  const [categories, total] = await this.productCategoryRepository.findAndCount({
    take,
    skip,
    relations: ['location'],
    order: { id: 'DESC' },
  });

  return {
    statusCode: 200,
    message: total > 0 ? 'Product categories retrieved successfully.' : 'No product categories found.',
    data: {
      categories,
      total,
      page,
      totalPages: Math.ceil(total / take),
    },
  };
}
// async findByFilters(
//   filters: {
//     id?: number;
//     name?: string;
//     club_code?: string;
//     created_at?: string;
//   },
//   page = 1,
//   limit = 10,
// ): Promise<{
//   statusCode: number;
//   message: string;
//   data: {
//     categories: ProductCategory[];
//     total: number;
//     page: number;
//     totalPages: number;
//   };
// }> {
//   const query = this.productCategoryRepository.createQueryBuilder('pc');

//   if (filters.id !== undefined) {
//     query.andWhere('pc.id = :id', { id: filters.id });
//   }

//   if (filters.name) {
//     query.andWhere('LOWER(pc.name) LIKE LOWER(:name)', { name: `%${filters.name}%` });
//   }

//   if (filters.club_code) {
//     query.andWhere('LOWER(pc.club_code) LIKE LOWER(:club_code)', {
//       club_code: `%${filters.club_code}%`,
//     });
//   }

//   if (filters.created_at) {
//     query.andWhere('CAST(pc.created_at AS DATE) = :created_at', {
//       created_at: filters.created_at,
//     });
//   }

//   const [categories, total] = await query
//     .orderBy('pc.id', 'DESC')
//     .skip((page - 1) * limit)
//     .take(limit)
//     .getManyAndCount();

//   return {
//     statusCode: 200,
//     message: total > 0 ? 'Product categories found.' : 'No product categories matched your filters.',
//     data: {
//       categories,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// }
async findByFilters(
  filters: {
    id?: number;
    name?: string;
    club_code?: string;
    created_at?: string;
     is_active?: boolean;
      location_id?:number;
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: {
    categories: ProductCategory[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {

  if (!filters.location_id || isNaN(filters.location_id)) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be a valid number',
      data: {
        categories: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  const query = this.productCategoryRepository.createQueryBuilder('pc')
   .leftJoinAndSelect('pc.location', 'location')
    .leftJoinAndSelect('pc.creator', 'creator')
    .leftJoinAndSelect('pc.updator', 'updator');

if (filters.location_id !== undefined) {
  query.andWhere('pc.location_id = :location_id', { location_id: filters.location_id }); // ✅ CORRECT
}

  
  if (filters.id !== undefined) {
    query.andWhere('pc.id = :id', { id: filters.id });
  }

  if (filters.name && filters.name.trim() !== '') {
    query.andWhere('LOWER(pc.name) LIKE LOWER(:name)', {
      name: `%${filters.name.trim()}%`,
    });
  } else if (filters.name === '') {
    return {
      statusCode: 400,
      message: 'Invalid value for "name" filter',
      data: {
        categories: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }

  if (filters.club_code && filters.club_code.trim() !== '') {
    query.andWhere('LOWER(pc.club_code) LIKE LOWER(:club_code)', {
      club_code: `%${filters.club_code.trim()}%`,
    });
  }

  if (filters.created_at && filters.created_at.trim() !== '') {
    query.andWhere('CAST(pc.created_at AS DATE) = :created_at', {
      created_at: filters.created_at,
    });
  }

   if (filters.is_active !== undefined) {
    query.andWhere('pc.is_active = :is_active', { is_active: filters.is_active });
  }

  const [categories, total] = await query
    .orderBy('pc.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Product categories found.' : 'No product categories matched your filters.',
    data: {
      categories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async findOne(id: number): Promise<{
  statusCode: number;
  message: string;
  data: ProductCategory | null;
}> {
   const category = await this.productCategoryRepository.findOne({
    where: { id },
    relations: ['location'], 
  });

  if (!category) {
    return {
      statusCode: 404,
      message: `Product category with ID ${id} not found`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: `Product category with ID ${id} retrieved successfully`,
    data: category,
  };
}

async update(id: number, updateDto: UpdateProductCategoryDto): Promise<{
  statusCode: number;
  message: string;
  data: ProductCategory | null;
}> {
  const found = await this.productCategoryRepository.findOne({
    where: { id },
    relations: ['location','updator'], // include relation if needed
  });
 if (!updateDto.updated_by || typeof updateDto.updated_by !== 'number') {
    return {
      statusCode: 400,
      message: '`updated_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }
   const updator = await this.userRepository.findOne({ where: { id: updateDto.updated_by } });
  if (!updator) {
    return {
      statusCode: 404,
      message: `User with ID ${updateDto.updated_by} not found`,
      data: null,
    };
  }
  if (!found) {
    return {
      statusCode: 404,
      message: `Product category with ID ${id} not found`,
      data: null,
    };
  }

  // ✅ Manual check for location_id presence
  if (!updateDto.location_id) {
    return {
      statusCode: 400,
      message: 'location_id is required for update',
      data: null,
    };
  }

  // ✅ Optional: Validate if the location_id exists
  const location = await this.locationRepository.findOne({
    where: { id: updateDto.location_id },
  });

  if (!location) {
    return {
      statusCode: 404,
      message: `Location with ID ${updateDto.location_id} not found`,
      data: null,
    };
  }
const existing = await this.productCategoryRepository.findOne({
  where: {
    name: updateDto.name,
    id: Not(id),
  },
});
if (existing) {
  return {
    statusCode: 409,
    message: `Product category name '${updateDto.name}' already exists.`,
    data: null,
  };
}
  // ✅ Merge and save updated entity
  const updated = this.productCategoryRepository.merge(found, {
    ...updateDto,
    location,
    updator,
  });

 // const saved = await this.productCategoryRepository.save(updated);


  const saved = await this.productCategoryRepository.save(updated);

  // ✅ Fetch updated branch with relations
  const result = await this.productCategoryRepository.findOne({
    where: { id: saved.id },
    relations: ['location', 'updator'],
  });
  return {
    statusCode: 200,
    message: `Product category with ID ${id} updated successfully`,
    data: result,
  };
}


// async update(id: number, updateDto: UpdateProductCategoryDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: ProductCategory | null;
// }> {
//   const found = await this.productCategoryRepository.findOneBy({ id });

//   if (!found) {
//     return {
//       statusCode: 404,
//       message: `Product category with ID ${id} not found`,
//       data: null,
//     };
//   }

//   const updated = Object.assign(found, updateDto);
//   const saved = await this.productCategoryRepository.save(updated);

//   return {
//     statusCode: 200,
//     message: `Product category with ID ${id} updated successfully`,
//     data: saved,
//   };
// }
async remove(id: number): Promise<{
  statusCode: number;
  message: string;
}> {
  const found = await this.productCategoryRepository.findOneBy({ id });

  if (!found) {
    return {
      statusCode: 404,
      message: `Product category with ID ${id} not found`,
    };
  }

  await this.productCategoryRepository.remove(found);

  return {
    statusCode: 200,
    message: `Product category with ID ${id} deleted successfully`,
  };
}
async searchWithPagination(body: {
  Page: number;
  PageSize: number;
  StartDate?: string;
  EndDate?: string;
  Search?: string;
  BranchId?: number; 
  location_id?: number;
}): Promise<{
  statusCode: number;
  message: string;
  data: {
    categories: ProductCategory[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
   const { Page, PageSize, StartDate, EndDate, Search, location_id } = body;
  const page = body.Page || 1;
  const limit = body.PageSize || 10;
  const skip = (page - 1) * limit;
   if (!location_id || location_id <= 0) {
    return {
      statusCode: 400,
      message: 'Location_id is required and must be a valid number',
      data: {
        categories: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  const query = this.productCategoryRepository.createQueryBuilder('pc').leftJoinAndSelect('pc.location', 'location')
   .leftJoinAndSelect('pc.creator', 'creator')
    .leftJoinAndSelect('pc.updator', 'updator');

  if (location_id) {
    query.andWhere('location.id = :location_id', { location_id: location_id });
  }
  if (body.Search) {
    const keyword = `%${body.Search.toLowerCase()}%`;
    query.andWhere(
      `(LOWER(pc.name) LIKE :keyword OR LOWER(pc.club_code) LIKE :keyword)`,
      { keyword }
    );
  }

  if (body.StartDate && body.EndDate) {
    const start = new Date(body.StartDate);
    const end = new Date(body.EndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: {
          categories: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    query.andWhere('pc.created_at BETWEEN :startDate AND :endDate', {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }

  const [categories, total] = await query
    .orderBy('pc.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Search results found' : 'No product categories found',
    data: {
      categories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
async updateStatus(
  id: number,
): Promise<{ statusCode: number; message: string; data: ProductCategory | null }> {
  const category = await this.productCategoryRepository.findOne({ where: { id } });

  if (!category) {
    return {
      statusCode: 404,
      message: `Product category with ID ${id} not found`,
      data: null,
    };
  }

  category.is_active = !category.is_active;

  const updated = await this.productCategoryRepository.save(category);

  return {
    statusCode: 200,
    message: `Product category is now ${updated.is_active ? 'Active' : 'Inactive'}`,
    data: updated,
  };
}
}

