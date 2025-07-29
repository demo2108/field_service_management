import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/users/entities/user.entity';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';

@Injectable()
export class ProductService {
    constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
 
@InjectRepository(LocationMaster)
private readonly locationRepository: Repository<LocationMaster>,
  @InjectRepository(User)
      private readonly userRepository: Repository<User>,
 @InjectRepository(EventLog)
    private eventLogRepository: Repository<EventLog>,
  ) {}

//main
// async create(createProductDto: CreateProductDto): Promise<{
//   statusCode: number;
//   message: string;
//   data?: Product |null;
// }> {
//   const { location_id, ...rest } = createProductDto;

//   const existing = await this.productRepository.findOne({
//     where: {
//       name: createProductDto.name,
//       product_code: createProductDto.product_code,
//     },
//   });
//  if (!createProductDto.created_by || typeof createProductDto.created_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`created_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }
//   const creator = await this.userRepository.findOne({
//     where: { id: createProductDto.created_by },
//   });

//   if (!creator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${createProductDto.created_by} (creator) not found.`,
//       data: null,
//     };
//   }
//   if (existing) {
//     return {
//       statusCode: 400,
//       message: `Product with name "${createProductDto.name}" and product_code "${createProductDto.product_code}" already exists`,
//     };
//   }

//   const existingModel = await this.productRepository.findOne({
//     where: { model_number: createProductDto.model_number },
//   });

//   if (existingModel) {
//     return {
//       statusCode: 400,
//       message: `Product with model number "${createProductDto.model_number}" already exists`,
//     };
//   }

//   // ✅ Find location from LocationMaster table
//   const location = await this.locationRepository.findOne({
//     where: { id: location_id },
//   });

//   if (!location) {
//     return {
//       statusCode: 404,
//       message: `Location with ID "${location_id}" does not exist.`,
//     };
//   }

//   const product = this.productRepository.create({
//     ...rest,
//     location, 
//     creator,
//   });

//   const savedProduct = await this.productRepository.save(product);

//   const full = await this.productRepository.findOne({
//     where: { id: savedProduct.id },
//     relations: ['location','creator'], // ✅ Make sure location is returned
//   });

//   if (!full) {
//     return {
//       statusCode: 500,
//       message: 'Failed to fetch created product.',
//     };
//   }

//   return {
//     statusCode: 201,
//     message: 'Product created successfully',
//     data: full,
//   };
// }

async create(createProductDto: CreateProductDto): Promise<{
  statusCode: number;
  message: string;
  data?: Product | null;
}> {
  const { location_id, ...rest } = createProductDto;

  const existing = await this.productRepository.findOne({
    where: {
      name: createProductDto.name,
      product_code: createProductDto.product_code,
    },
  });

  if (!createProductDto.created_by || typeof createProductDto.created_by !== 'number') {
    return {
      statusCode: 400,
      message: '`created_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }

  const creator = await this.userRepository.findOne({
    where: { id: createProductDto.created_by },
  });

  if (!creator) {
    return {
      statusCode: 404,
      message: `User with ID ${createProductDto.created_by} (creator) not found.`,
      data: null,
    };
  }

  if (existing) {
    return {
      statusCode: 400,
      message: `Product with name "${createProductDto.name}" and product_code "${createProductDto.product_code}" already exists`,
    };
  }

  const existingModel = await this.productRepository.findOne({
    where: { model_number: createProductDto.model_number },
  });

  if (existingModel) {
    return {
      statusCode: 400,
      message: `Product with model number "${createProductDto.model_number}" already exists`,
    };
  }

  // ✅ Find location from LocationMaster table
  const location = await this.locationRepository.findOne({
    where: { id: location_id },
  });

  if (!location) {
    return {
      statusCode: 404,
      message: `Location with ID "${location_id}" does not exist.`,
    };
  }

  const product = this.productRepository.create({
    ...rest,
    location,
    creator,
  });

  const savedProduct = await this.productRepository.save(product);

  const full = await this.productRepository.findOne({
    where: { id: savedProduct.id },
    relations: ['location', 'creator'],
  });

  if (!full) {
    return {
      statusCode: 500,
      message: 'Failed to fetch created product.',
    };
  }

  // ✅ Create event log for product creation
  await this.eventLogRepository.save({
    event_name: 'product_craete',
    product_id: savedProduct.id,
    status: 'CREATED',
    //user_id: createProductDto.created_by,
    changed_by: createProductDto.created_by,
    changed_at: new Date(),
     location_time: new Date(),
    remark: JSON.parse(JSON.stringify(full)), // Store full product details as remark
  });

  return {
    statusCode: 201,
    message: 'Product created successfully',
    data: full,
  };
}

  async findAll(page = 1): Promise<{
  statusCode: number;
  message: string;
  data: {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const take = 10;
  const skip = (page - 1) * take;

  const [products, total] = await this.productRepository.findAndCount({
    take,
    skip,
     relations: ['location'],
    order: { id: 'DESC' },
  });

  return {
    statusCode: 200,
    message: total > 0 ? 'Products retrieved successfully.' : 'No products found.',
    data: {
      products,
      total,
      page,
      totalPages: Math.ceil(total / take),
    },
  };
}

async findByFilters(
  filters: {
    id?: number;
    type_id?: number;
   work_order_type?: number[]; 
    name?: string;
    model_number?: string;
    expiry_date?: string;
    is_active?: boolean;
    replacement_of?: number;
    club_code?: string;
    make?: string;
    contract_type?: string;
    duration?: string;
       product_code?: string;
       location_id?:number;
       

  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: {
    products: Product[];
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
        products: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  const query = this.productRepository.createQueryBuilder('product') 
  .leftJoinAndSelect('product.location', 'location')
  .leftJoinAndSelect('product.creator', 'creator')
    .leftJoinAndSelect('product.updator', 'updator'); 

    query.andWhere('product.location_id = :location_id', {
    location_id: filters.location_id,
  });
  if (filters.id !== undefined) {
    query.andWhere('product.id = :id', { id: filters.id });
  }

  if (filters.type_id !== undefined) {
    query.andWhere('product.type_id = :type_id', { type_id: filters.type_id });
  }
// ... existing filters ...

if (filters.work_order_type && filters.work_order_type.length > 0) {
  query.andWhere('product.work_order_type && CAST(ARRAY[:...work_order_type] AS int[])', {
    work_order_type: filters.work_order_type,
  });
}



  if (filters.name !== undefined) {
    if (filters.name.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "name" filter',
        data: { products: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('LOWER(product.name) LIKE LOWER(:name)', {
      name: `%${filters.name.trim()}%`,
    });
  }

  if (filters.model_number !== undefined) {
    if (filters.model_number.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "model_number" filter',
        data: { products: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('LOWER(product.model_number) LIKE LOWER(:model_number)', {
      model_number: `%${filters.model_number.trim()}%`,
    });
  }

  if (filters.expiry_date !== undefined) {
    if (filters.expiry_date.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "expiry_date" filter',
        data: { products: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('product.expiry_date = :expiry_date', {
      expiry_date: filters.expiry_date.trim(),
    });
  }

  if (filters.is_active !== undefined) {
    query.andWhere('product.is_active = :is_active', {
      is_active: filters.is_active,
    });
  }

  if (filters.replacement_of !== undefined) {
    query.andWhere('product.replacement_of = :replacement_of', {
      replacement_of: filters.replacement_of,
    });
  }

  if (filters.club_code !== undefined) {
    if (filters.club_code.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "club_code" filter',
        data: { products: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere(':club_code = ANY(product.club_code)', {
      club_code: filters.club_code.trim(),
    });
  }

  if (filters.make !== undefined) {
    if (filters.make.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "make" filter',
        data: { products: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('LOWER(product.make) LIKE LOWER(:make)', {
      make: `%${filters.make.trim()}%`,
    });
  }

  if (filters.contract_type !== undefined) {
    if (filters.contract_type.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "contract_type" filter',
        data: { products: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('LOWER(product.contract_type) LIKE LOWER(:contract_type)', {
      contract_type: `%${filters.contract_type.trim()}%`,
    });
  }

if (filters.duration !== undefined) {
  if (filters.duration.trim() === '') {
    return {
      statusCode: 400,
      message: 'Invalid value for "duration" filter',
      data: { products: [], total: 0, page, totalPages: 0 },
    };
  }
  query.andWhere('LOWER(product.duration) LIKE LOWER(:duration)', {
    duration: `%${filters.duration.trim()}%`,
  });
}

if (filters.product_code !== undefined) {
  if (filters.product_code.trim() === '') {
    return {
      statusCode: 400,
      message: 'Invalid value for "product_code" filter',
      data: { products: [], total: 0, page, totalPages: 0 },
    };
  }
  query.andWhere('LOWER(product.product_code) LIKE LOWER(:product_code)', {
    product_code: `%${filters.product_code.trim()}%`,
  });
}


  const [products, total] = await query
    .orderBy('product.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message:
      total > 0 ? 'Filtered products retrieved successfully.' : 'No matching products found.',
    data: {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async findOne(id: number): Promise<{
  statusCode: number;
  message: string;
  data: Product | null;
}> {
  const product = await this.productRepository.findOne({ where: { id } ,relations: ['location'],});

  if (!product) {
    return {
      statusCode: 404,
      message: `Product with ID ${id} not found`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: `Product with ID ${id} retrieved successfully.`,
    data: product,
  };
}
//main
// async update(
//   id: number,
//   updateProductDto: Partial<CreateProductDto>
// ): Promise<{
//   statusCode: number;
//   message: string;
//   data: Product | null;
// }> {
//   const product = await this.productRepository.findOne({
//     where: { id },
//     relations: ['location', 'updator'], // include related entities for output
//   });

//   if (!updateProductDto.updated_by || typeof updateProductDto.updated_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`updated_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }
// if (updateProductDto.is_product === undefined) {
//   return {
//     statusCode: 400,
//     message: '`is_product` is required and must be a boolean.',
//     data: null,
//   };
// }
// if (typeof updateProductDto.is_product !== 'boolean') {
//   return {
//     statusCode: 400,
//     message: '`is_product` must be a boolean value (true or false).',
//     data: null,
//   };
// }
//   const updator = await this.userRepository.findOne({ where: { id: updateProductDto.updated_by } });

//   if (!updator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${updateProductDto.updated_by} not found.`,
//       data: null,
//     };
//   }

//   if (!product) {
//     return {
//       statusCode: 404,
//       message: `Product with ID ${id} not found.`,
//       data: null,
//     };
//   }


  
//   // Validate location requirement
//   const isIncomingLocationMissing = updateProductDto.location_id === undefined;
//   const isExistingLocationMissing = product.location_id === null || product.location_id === undefined;

//   if (isIncomingLocationMissing && isExistingLocationMissing) {
//     return {
//       statusCode: 400,
//       message: 'location_id is required for update.',
//       data: null,
//     };
//   }

//   // If new location_id is given, fetch and assign
//   if (updateProductDto.location_id !== undefined) {
//     const location = await this.locationRepository.findOne({
//       where: { id: updateProductDto.location_id },
//     });

//     if (!location) {
//       return {
//         statusCode: 404,
//         message: `Location with ID ${updateProductDto.location_id} not found.`,
//         data: null,
//       };
//     }

//     product.location = location;
//     product.location_id = location.id;
//   }

//   // Assign all updatable fields
//   Object.assign(product, updateProductDto);

//   // Set foreign key & relation for updated_by
//   product.updated_by = updator.id;
//   product.updator = updator;

//   // `updated_at` is handled automatically by @UpdateDateColumn

//   await this.productRepository.save(product);

//   // Reload product to include updated_by (updator) relation in response
//   const final = await this.productRepository.findOne({
//     where: { id },
//     relations: ['location', 'updator'],
//   });

//   return {
//     statusCode: 200,
//     message: `Product with ID ${id} updated successfully.`,
//     data: final,
//   };
// }
async update(
  id: number,
  updateProductDto: Partial<CreateProductDto>
): Promise<{
  statusCode: number;
  message: string;
  data: Product | null;
}> {
  const product = await this.productRepository.findOne({
    where: { id },
    relations: ['location', 'updator'], // include related entities for output
  });

  if (!updateProductDto.updated_by || typeof updateProductDto.updated_by !== 'number') {
    return {
      statusCode: 400,
      message: '`updated_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }

  if (updateProductDto.is_product === undefined) {
    return {
      statusCode: 400,
      message: '`is_product` is required and must be a boolean.',
      data: null,
    };
  }

  if (typeof updateProductDto.is_product !== 'boolean') {
    return {
      statusCode: 400,
      message: '`is_product` must be a boolean value (true or false).',
      data: null,
    };
  }

  const updator = await this.userRepository.findOne({ where: { id: updateProductDto.updated_by } });

  if (!updator) {
    return {
      statusCode: 404,
      message: `User with ID ${updateProductDto.updated_by} not found.`,
      data: null,
    };
  }

  if (!product) {
    return {
      statusCode: 404,
      message: `Product with ID ${id} not found.`,
      data: null,
    };
  }

  // Validate location requirement
  const isIncomingLocationMissing = updateProductDto.location_id === undefined;
  const isExistingLocationMissing = product.location_id === null || product.location_id === undefined;

  if (isIncomingLocationMissing && isExistingLocationMissing) {
    return {
      statusCode: 400,
      message: 'location_id is required for update.',
      data: null,
    };
  }

  // If new location_id is given, fetch and assign
  if (updateProductDto.location_id !== undefined) {
    const location = await this.locationRepository.findOne({
      where: { id: updateProductDto.location_id },
    });

    if (!location) {
      return {
        statusCode: 404,
        message: `Location with ID ${updateProductDto.location_id} not found.`,
        data: null,
      };
    }

    product.location = location;
    product.location_id = location.id;
  }

  // Assign all updatable fields
  Object.assign(product, updateProductDto);

  // Set foreign key & relation for updated_by
  product.updated_by = updator.id;
  product.updator = updator;

  // Save updated product
  await this.productRepository.save(product);

  // Save event log with input body as remark
  await this.eventLogRepository.save({
     status: 'UPDATED',
         product_id: id,
    //user_id: createProductDto.created_by,
    changed_by: updateProductDto.updated_by,
        changed_at: new Date(),
     location_time: new Date(),
    event_name: 'product_update',
    remark: JSON.parse(JSON.stringify(updateProductDto)), // ensure object format
  });

  // Reload product to include updated_by (updator) relation in response
  const final = await this.productRepository.findOne({
    where: { id },
    relations: ['location', 'updator'],
  });

  return {
    statusCode: 200,
    message: `Product with ID ${id} updated successfully.`,
    data: final,
  };
}


async remove(id: number): Promise<{
  statusCode: number;
  message: string;
}> {
  const product = await this.productRepository.findOne({ where: { id } });

  if (!product) {
    return {
      statusCode: 404,
      message: `Product with ID ${id} not found`,
    };
  }

  await this.productRepository.remove(product);

  return {
    statusCode: 200,
    message: 'Product deleted successfully.',
  };
}
async searchWithPagination(body: {
  Page: number;
  PageSize: number;
  StartDate?: string;
  EndDate?: string;
  Search?: string;
     location_id?: number;
  // BranchId?: number; // Optional, not used here
}): Promise<{
  statusCode: number;
  message: string;
  data: {
    products: Product[];
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
        products: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  const query = this.productRepository.createQueryBuilder('product') 
   .leftJoinAndSelect('product.creator', 'creator')
    .leftJoinAndSelect('product.updator', 'updator')
    .leftJoinAndSelect('product.location', 'location');

  if (body.Search) {
    const keyword = `%${body.Search.toLowerCase()}%`;
    query.andWhere(
      `(LOWER(product.name) LIKE :keyword OR LOWER(product.model_number) LIKE :keyword)`,
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
          products: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    query.andWhere('product.added_at BETWEEN :startDate AND :endDate', {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }

  
    if (location_id) {
    query.andWhere('location.id = :location_id', { location_id: location_id });
  }
  const [products, total] = await query
    .orderBy('product.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Products found successfully.' : 'No products found.',
    data: {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
async updateStatus(
  id: number,
): Promise<{ statusCode: number; message: string; data: Product | null }> {
  const product = await this.productRepository.findOne({ where: { id } });

  if (!product) {
    return {
      statusCode: 404,
      message: `Product with ID ${id} not found`,
      data: null,
    };
  }

  product.is_active = !product.is_active;

  const updated = await this.productRepository.save(product);

  return {
    statusCode: 200,
    message: `Product is now ${updated.is_active ? 'Active' : 'Inactive'}`,
    data: updated,
  };
}
  }




  
