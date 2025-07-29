import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { UpdateBranchStatusDto } from './dto/update-branch-status.dto';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BranchService {
      constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
       @InjectRepository(LocationMaster)
    private readonly locationRepository: Repository<LocationMaster>,
        @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  ) {}
async create(dto: CreateBranchDto): Promise<{
  statusCode: number;
  message: string;
  data: Branch | null;
}> {

  if (!dto.created_by || typeof dto.created_by !== 'number') {
    return {
      statusCode: 400,
      message: '`created_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }

  
  const customer = await this.customerRepository.findOne({
    where: { id: dto.customer_id },
  });

  if (!customer) {
    return {
      statusCode: 404,
      message: `Customer with id ${dto.customer_id} not found`,
      data: null,
    };
  }

 
  if (dto.branch_name) {
    const existingBranch = await this.branchRepository.findOne({
      where: { branch_name: dto.branch_name },
    });

    if (existingBranch) {
      return {
        statusCode: 400,
        message: `Branch name '${dto.branch_name}' already exists.`,
        data: null,
      };
    }
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

  // ✅ Optional: fetch location
  let location: LocationMaster | undefined = undefined;

  if (dto.location_id) {
    const foundLocation = await this.locationRepository.findOne({
      where: { id: dto.location_id },
    });

    if (!foundLocation) {
      return {
        statusCode: 404,
        message: `Location with id ${dto.location_id} not found`,
        data: null,
      };
    }

    location = foundLocation;
  }

  // ✅ Create branch
  const branch = this.branchRepository.create({
    ...dto,
    customer,
    location,
    creator, // assign full creator user entity
  });

  // ✅ Save branch
  const savedBranch = await this.branchRepository.save(branch);

  // ✅ Fetch complete data with relations
  const result = await this.branchRepository.findOne({
    where: { id: savedBranch.id },
    relations: ['customer', 'location', 'creator'], // include creator relation
  });

  return {
    statusCode: 201,
    message: 'Branch created successfully',
    data: result,
  };
}
async update(id: number, dto: UpdateBranchDto): Promise<{
  statusCode: number;
  message: string;
  data: Branch | null;
}> {
  // ✅ Validate updated_by
  if (!dto.updated_by || typeof dto.updated_by !== 'number') {
    return {
      statusCode: 400,
      message: '`updated_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }

  // ✅ Find branch
  const branch = await this.branchRepository.findOne({ where: { id } });

  if (!branch) {
    return {
      statusCode: 404,
      message: `Branch with id ${id} not found`,
      data: null,
    };
  }

  // ✅ Validate updator user
  const updator = await this.userRepository.findOne({ where: { id: dto.updated_by } });
  if (!updator) {
    return {
      statusCode: 404,
      message: `User with ID ${dto.updated_by} not found`,
      data: null,
    };
  }

  // ✅ Validate and assign new customer
  if (dto.customer_id) {
    const customer = await this.customerRepository.findOne({ where: { id: dto.customer_id } });
    if (!customer) {
      return {
        statusCode: 404,
        message: `Customer with id ${dto.customer_id} not found`,
        data: null,
      };
    }
    branch.customer = customer;
  }

  // ✅ Validate and assign new location
  if (dto.location_id) {
    const location = await this.locationRepository.findOne({ where: { id: dto.location_id } });
    if (!location) {
      return {
        statusCode: 404,
        message: `Location with id ${dto.location_id} not found`,
        data: null,
      };
    }
    branch.location = location;
  }

  // ✅ Prevent duplicate branch name
  if (dto.branch_name) {
    const existingBranch = await this.branchRepository.findOne({
      where: { branch_name: dto.branch_name },
    });

    if (existingBranch && existingBranch.id !== id) {
      return {
        statusCode: 400,
        message: `Branch name '${dto.branch_name}' already exists.`,
        data: null,
      };
    }
  }

  // ✅ Update fields and set updator + timestamp
  Object.assign(branch, dto);
  branch.updator = updator;
  branch.updated_at = new Date();

  // ✅ Save updated branch
  const updatedBranch = await this.branchRepository.save(branch);

  // ✅ Fetch updated branch with relations
  const result = await this.branchRepository.findOne({
    where: { id: updatedBranch.id },
    relations: ['customer', 'location', 'updator'],
  });

  return {
    statusCode: 200,
    message: 'Branch updated successfully',
    data: result,
  };
}

// async create(dto: CreateBranchDto): Promise<{ statusCode: number; message: string; data: Branch | null }> {

//   const customer = await this.customerRepository.findOne({
//     where: { id: dto.customer_id },
//   });
//  if (!dto.created_by || typeof dto.created_by !== 'number') {
//       return {
//         statusCode: 400,
//         message: '`created_by` is required and must be a valid numeric user ID.',
//         data: null,
//       };
//     }
//   if (!customer) {
//     return {
//       statusCode: 404,
//       message: `Customer with id ${dto.customer_id} not found`,
//       data: null,
//     };
//   }

//   // Check for existing branch name
//   if (dto.branch_name) {
//     const existingBranch = await this.branchRepository.findOne({
//       where: { branch_name: dto.branch_name },
//     });

//     if (existingBranch) {
//       return {
//         statusCode: 400,
//         message: `Branch name '${dto.branch_name}' already exists.`,
//         data: null,
//       };
//     }
//   }
//   let creator: User | null = null;

//    if (dto.created_by) {
//   creator = await this.userRepository.findOne({
//     where: { id: dto.created_by },
//   });

//   if (!creator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${dto.created_by} (creator) not found.`,
//       data: null,
//     };
//   }
// }

//   // Handle optional location_id
//   let location: LocationMaster | undefined = undefined;

//   if (dto.location_id) {
//     const foundLocation = await this.locationRepository.findOne({
//       where: { id: dto.location_id },
//     });

//     if (!foundLocation) {
//       return {
//         statusCode: 404,
//         message: `Location with id ${dto.location_id} not found`,
//         data: null,
//       };
//     }

//     location = foundLocation;
//   }

//   // Create branch
//   const branch = this.branchRepository.create({
//     ...dto,
//     customer,
//     location, 
//      creator,// assign relation
//   });

//   // Save branch
//   const savedBranch = await this.branchRepository.save(branch);

//   // Fetch full branch with relations
//   const result = await this.branchRepository.findOne({
//     where: { id: savedBranch.id },
//     relations: ['customer', 'location','creator'], // ensure customer and location are loaded
//   });

//   return {
//     statusCode: 201,
//     message: 'Branch created successfully',
//     data: result,
//   };
// }

// async update(id: number, dto: UpdateBranchDto): Promise<{ statusCode: number; message: string; data: Branch | null }> {
//   const branch = await this.branchRepository.findOne({ where: { id } });

//   if (!branch) {
//     return {
//       statusCode: 404,
//       message: `Branch with id ${id} not found`,
//       data: null,
//     };
//   }

//   if (dto.customer_id) {
//     const customer = await this.customerRepository.findOne({ where: { id: dto.customer_id } });

//     if (!customer) {
//       return {
//         statusCode: 404,
//         message: `Customer with id ${dto.customer_id} not found`,
//         data: null,
//       };
//     }

//     branch.customer = customer;
//   }

//   const existingBranch = await this.branchRepository.findOne({
//     where: { branch_name: dto.branch_name },
//   });

//   if (existingBranch && existingBranch.id !== id) {
//     return {
//       statusCode: 400,
//       message: `Branch name '${dto.branch_name}' already exists.`,
//       data: null,
//     };
//   }

//   Object.assign(branch, dto);
//   const updatedBranch = await this.branchRepository.save(branch);

//   return {
//     statusCode: 200,
//     message: `Branch updated successfully`,
//     data: updatedBranch,
//   };
// }

// async update(id: number, dto: UpdateBranchDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: Branch | null;
// }> {
//   // Find the branch
//   const branch = await this.branchRepository.findOne({ where: { id } });
//   if (!dto.updated_by || typeof dto.updated_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`updated_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }

//   if (!branch) {
//     return {
//       statusCode: 404,
//       message: `Branch with id ${id} not found`,
//       data: null,
//     };
//   }

//   // Validate and assign new customer if provided
//   if (dto.customer_id) {
//     const customer = await this.customerRepository.findOne({ where: { id: dto.customer_id } });

//     if (!customer) {
//       return {
//         statusCode: 404,
//         message: `Customer with id ${dto.customer_id} not found`,
//         data: null,
//       };
//     }

//     branch.customer = customer;
//   }

//   // Validate and assign new location if provided
//   if (dto.location_id) {
//     const location = await this.locationRepository.findOne({ where: { id: dto.location_id } });

//     if (!location) {
//       return {
//         statusCode: 404,
//         message: `Location with id ${dto.location_id} not found`,
//         data: null,
//       };
//     }

//     branch.location = location;
//   }

//   // Prevent duplicate branch name
//   if (dto.branch_name) {
//     const existingBranch = await this.branchRepository.findOne({
//       where: { branch_name: dto.branch_name },
//     });

//     if (existingBranch && existingBranch.id !== id) {
//       return {
//         statusCode: 400,
//         message: `Branch name '${dto.branch_name}' already exists.`,
//         data: null,
//       };
//     }
//   }

//   // Update other fields
//   Object.assign(branch, dto);

//   // Save updated branch
//   const updatedBranch = await this.branchRepository.save(branch);

//   // Fetch updated branch with relations
//   const result = await this.branchRepository.findOne({
//     where: { id: updatedBranch.id },
//     relations: ['customer', 'location'],
//   });

//   return {
//     statusCode: 200,
//     message: 'Branch updated successfully',
//     data: result,
//   };
// }

async delete(id: number): Promise<{ statusCode: number; message: string }> {
  try {
    const result = await this.branchRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    return {
      statusCode: 200,
      message: `Branch with ID ${id} deleted successfully`,
    };
  } catch (error) {
    if (error.code === '23503') {
      // Foreign key violation
      return {
        statusCode: 400,
        message: `Branch with ID ${id} cannot be deleted because it is linked to other records.`,
      };
    }

    throw error; // re-throw other errors
  }
}
async getAll(page = 1): Promise<{
  statusCode: number;
  message: string;
  data: { branches: Branch[]; total: number; page: number };
}> {
  const take = 10;
  const skip = (page - 1) * take;

  const [branches, total] = await this.branchRepository.findAndCount({
    take,
    skip,
    order: { id: 'DESC' },
    relations: ['customer', 'location'],
  });

  return {
    statusCode: 200,
    message: total > 0 ? 'Branches retrieved successfully' : 'No branches found',
    data: {
      branches,
      total,
      page,
    },
  };
}
async getById(id: number): Promise<{
  statusCode: number;
  message: string;
  data: Branch;
}> {
  const branch = await this.branchRepository.findOne({
    where: { id },
    relations: ['customer'],
  });

  if (!branch) {
    throw new NotFoundException(`Branch with id ${id} not found`);
  }

  return {
    statusCode: 200,
    message: `Branch with ID ${id} retrieved successfully`,
    data: branch,
  };
}
// async findByFilters(
//   filters: {
//     id?: number | string;
//     branch_name?: string;
//     city?: string;
//     country?: string;
//     pincode?: string;
//     address?: string;
//     state?: string;
//   },
//   page = 1,
//   limit = 10,
// ): Promise<{
//   statusCode: number;
//   message: string;
//   data: { branches: Branch[]; total: number; page: number };
// }> {
//   const query = this.branchRepository.createQueryBuilder('branch')
//     .leftJoinAndSelect('branch.customer', 'customer');

//  if (filters.id !== undefined) {
//   const parsedId = Number(filters.id);
//   if (isNaN(parsedId)) {
//     return {
//       statusCode: 400,
//       message: 'Invalid value for "id" filter',
//       data: { branches: [], total: 0, page },
//     };
//   }
//   query.andWhere('branch.id = :id', { id: parsedId });
// }

//   if (filters.branch_name !== undefined) {
//     if (filters.branch_name.trim() === '') {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "branch_name" filter',
//         data: {
//           branches: [],
//           total: 0,
//           page,
//         },
//       };
//     }
//     query.andWhere('LOWER(branch.branch_name) LIKE LOWER(:branch_name)', {
//       branch_name: `%${filters.branch_name.trim()}%`,
//     });
//   }

//   if (filters.city !== undefined) {
//     if (filters.city.trim() === '') {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "city" filter',
//         data: { branches: [], total: 0, page },
//       };
//     }
//     query.andWhere('LOWER(branch.city) LIKE LOWER(:city)', {
//       city: `%${filters.city.trim()}%`,
//     });
//   }

//   if (filters.country !== undefined) {
//     if (filters.country.trim() === '') {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "country" filter',
//         data: { branches: [], total: 0, page },
//       };
//     }
//     query.andWhere('LOWER(branch.country) LIKE LOWER(:country)', {
//       country: `%${filters.country.trim()}%`,
//     });
//   }

//   if (filters.pincode !== undefined) {
//     if (filters.pincode.trim() === '') {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "pincode" filter',
//         data: { branches: [], total: 0, page },
//       };
//     }
//     query.andWhere('branch.pincode LIKE :pincode', {
//       pincode: `%${filters.pincode.trim()}%`,
//     });
//   }

//   if (filters.address !== undefined) {
//     if (filters.address.trim() === '') {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "address" filter',
//         data: { branches: [], total: 0, page },
//       };
//     }
//     query.andWhere('LOWER(branch.address) LIKE LOWER(:address)', {
//       address: `%${filters.address.trim()}%`,
//     });
//   }

//   if (filters.state !== undefined) {
//     if (filters.state.trim() === '') {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "state" filter',
//         data: { branches: [], total: 0, page },
//       };
//     }
//     query.andWhere('LOWER(branch.state) LIKE LOWER(:state)', {
//       state: `%${filters.state.trim()}%`,
//     });
//   }

//   const [branches, total] = await query
//     .orderBy('branch.id', 'DESC')
//     .skip((page - 1) * limit)
//     .take(limit)
//     .getManyAndCount();

//   return {
//     statusCode: 200,
//     message: total > 0
//       ? 'Branches retrieved successfully'
//       : 'No branches found matching the filters',
//     data: {
//       branches,
//       total,
//       page,
//     },
//   };
// }
async findByFilters(
  filters: {
    id?: number | string;
    branch_name?: string;
    city?: string;
    country?: string;
    pincode?: string;
    address?: string;
    state?: string;
    location_id?: number;
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: {
     branches: Branch[]; 
     total: number; 
     page: number
     };
}> {
     if (!filters.location_id || isNaN(filters.location_id)) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be a valid number',
      data: {
        branches: [],
        total: 0,
        page,
       
      },
    };
  }
  const query = this.branchRepository.createQueryBuilder('branch')
    .leftJoinAndSelect('branch.customer', 'customer')
    .leftJoinAndSelect('branch.location', 'location')
       .leftJoinAndSelect('branch.creator', 'creator')
    .leftJoinAndSelect('branch.updator', 'updator'); // ✅ include location join
   

  query.andWhere('branch.location_id = :location_id', {
  location_id: filters.location_id,
});

  if (filters.id !== undefined) {
    const parsedId = Number(filters.id);
    if (isNaN(parsedId)) {
      return {
        statusCode: 400,
        message: 'Invalid value for "id" filter',
        data: { branches: [], total: 0, page },
      };
    }
    query.andWhere('branch.id = :id', { id: parsedId });
  }
   if (!filters.location_id || filters.location_id <= 0) {
    return {
      statusCode: 400,
      message: 'Location_id is required and must be a valid number',
      data: {
        branches: [],
        total: 0,
        page,
      
      },
    };
  }
  // if (filters.location_id !== undefined) {
  //   query.andWhere('branch.location_id = :location_id', {
  //     location_id: filters.location_id,
  //   });
  // }

  // ... keep your existing filters for branch_name, city, etc.

  const [branches, total] = await query
    .orderBy('branch.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Branches retrieved successfully' : 'No branches found matching the filters',
    data: {
      branches,
      total,
      page,
    },
  };
}

async searchWithPagination(
  body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
    CustomerId?: number;
     location_id?: number;
    
  },
): Promise<{
  statusCode: number;
  message: string;
  data: {
    branches: Branch[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const { Page, PageSize, StartDate, EndDate, Search, CustomerId,location_id } = body;
  const page = Page || 1;
  const limit = PageSize || 10;
  const skip = (page - 1) * limit;


   if (!location_id || location_id <= 0) {
    return {
      statusCode: 400,
      message: 'Location_id is required and must be a valid number',
      data: {
        branches: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }

  const query = this.branchRepository
    .createQueryBuilder('branch')
    .leftJoinAndSelect('branch.customer', 'customer')
    .leftJoinAndSelect('branch.location', 'location')
     .leftJoinAndSelect('branch.creator', 'creator')
    .leftJoinAndSelect('branch.updator', 'updator');

 
  if (Search) {
    const search = `%${Search.toLowerCase()}%`;
    query.andWhere(
      `(LOWER(branch.branch_name) LIKE :search OR LOWER(branch.location_id) LIKE :search OR LOWER(branch.city) LIKE :search OR LOWER(branch.state) LIKE :search OR LOWER(branch.country) LIKE :search OR LOWER(branch.pincode) LIKE :search)`,
      { search },
    );
  }

  // 🧾 Customer filter
  if (CustomerId) {
    query.andWhere('customer.id = :customerId', { customerId: CustomerId });
  }

    if (location_id) {
    query.andWhere('location.id = :location_id', { location_id: location_id });
  }
  // 📅 Timestamp filtering
  if (StartDate && EndDate) {
    const start = new Date(StartDate);
    const end = new Date(EndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: {
          branches: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    query.andWhere('branch.created_at BETWEEN :start AND :end', {
      start: start.toISOString(),
      end: end.toISOString(),
    });
  }

  const [branches, total] = await query
    .orderBy('branch.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Branches retrieved successfully' : 'No branches found',
    data: {
      branches,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
// async updateStatus(
//   id: number,
//   dto: UpdateBranchStatusDto,
// ): Promise<{ statusCode: number; message: string; data: Branch | null }> {
//   const branch = await this.branchRepository.findOne({ where: { id } });

//   if (!branch) {
//     return {
//       statusCode: 404,
//       message: `branch with ID ${id} not found`,
//       data: null,
//     };
//   }

//   branch.is_active = dto.is_active ?? branch.is_active;
//   const updated = await this.branchRepository.save(branch);

//   return {
//     statusCode: 200,
//     message: 'branch status updated successfully',
//     data: updated,
//   };
// }

async updateStatus(
  id: number,
): Promise<{ statusCode: number; message: string; data: Branch | null }> {
  const branch = await this.branchRepository.findOne({ where: { id } });

  if (!branch) {
    return {
      statusCode: 404,
      message: `Branch with ID ${id} not found`,
      data: null,
    };
  }

  // Toggle is_active
  branch.is_active = !branch.is_active;

  const updated = await this.branchRepository.save(branch);

  return {
    statusCode: 200,
    message: `Branch status updated to ${updated.is_active ? 'Active' : 'Inactive'}`,
    data: updated,
  };
}
// async findByIdOrNameOrEmailPaginated(
//   value: string,
//   page: number = 1,
//   limit: number = 10,
// ): Promise<{ data: Branch[]; total: number }> {
//   const id = parseInt(value, 10);

//   const queryBuilder = this.branchRepository.createQueryBuilder('branch');

//   if (!isNaN(id)) {
//     queryBuilder.where('branch.id = :id', { id });
//   } else {
//     queryBuilder.where('branch.branch_name LIKE :value', { value: `%${value}%` })
//       .orWhere('branch.city LIKE :value', { value: `%${value}%` })
//           .orWhere('branch.country LIKE :value', { value: `%${value}%` })
//             queryBuilder.where('"branch.pincode" = :value', { value })            
//                   .orWhere('branch.address LIKE :value', { value: `%${value}%` })
//       .orWhere('branch.state LIKE :value', { value: `%${value}%` });
//   }

 
//   const [data, total] = await queryBuilder
//     .orderBy('branch.id', 'DESC')
//     .skip((page - 1) * limit)
//     .take(limit)
//     .getManyAndCount();

//   if (total === 0) {
//     throw new NotFoundException(`No branch found matching "${value}"`);
//   }

//   return { data, total };
// }
}
