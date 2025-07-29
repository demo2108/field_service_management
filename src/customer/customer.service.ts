import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer-dto';
import { CustomerProduct } from 'src/customer_products/entities/customer-product.entity';
import { UpdateCustomerStatusDto } from './dto/update-customer-status.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CustomerService {
     constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        @InjectRepository(CustomerProduct)
        private readonly customerProductRepository: Repository<CustomerProduct>,
               @InjectRepository(User)
              private readonly userRepository: Repository<User>,
      ) {}
    
  async create(dto: CreateCustomerDto): Promise<{ statusCode: number; message: string; data: Customer | null }> {
  const existing = await this.customerRepository.findOne({
    where: { company_code: dto.company_code },
  });
  if (!dto.created_by || typeof dto.created_by !== 'number') {
    return {
      statusCode: 400,
      message: '`created_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }
  if (existing) {
    return {
      statusCode: 409,
      message: `Customer with company_code "${dto.company_code}" already exists`,
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

   const customer = this.customerRepository.create({
    ...dto,
    location: dto.location_id ? { id: dto.location_id } : undefined, 
    creator,// ✅ assign relation
    
  });
 const savedCustomer = await this.customerRepository.save(customer);

  const withRelations = await this.customerRepository.findOne({
    where: { id: savedCustomer.id },
    relations: ['location','creator'], 
  });
  return {
    statusCode: 201,
    message: 'Customer created successfully',
    data: withRelations,
  };
}
//   async update(id: number, dto: CreateCustomerDto): Promise<{ statusCode: number; message: string; data: Customer }> {
//   const customer = await this.customerRepository.findOne({ where: { id } });

//   if (!customer) {
//     throw new NotFoundException(`Customer with id ${id} not found`);
//   }

//   const updated = Object.assign(customer, dto);
//   const savedCustomer = await this.customerRepository.save(updated);

//   return {
//     statusCode: 200,
//     message: `Customer with ID ${id} updated successfully`,
//     data: savedCustomer,
//   };
// }  


async update(id: number, dto: CreateCustomerDto): Promise<{
  statusCode: number;
  message: string;
  data: Customer| null;
}> {
  const customer = await this.customerRepository.findOne({ where: { id } });
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
  if (!customer) {
    throw new NotFoundException(`Customer with id ${id} not found`);
  }

  // Manually assign location relation if location_id is provided
  if (dto.location_id) {
    (customer as any).location = { id: dto.location_id };
  }
 (customer as any).updator = updator;
  // Update other fields
  Object.assign(customer, dto);

  const savedCustomer = await this.customerRepository.save(customer);

  // Reload with relations (e.g., location)
  const withRelations = await this.customerRepository.findOne({
    where: { id: savedCustomer.id },
    relations: ['location','updator'],
  });

  return {
    statusCode: 200,
    message: `Customer with ID ${id} updated successfully`,
    data: withRelations!,
  };
}

//   async findByIdOrNameOrEmailPaginated(
//   value: string,
//   page: number = 1,
//   limit: number = 10,
// ): Promise<{ statusCode: number;
//   message: string; data: Customer[]; total: number }> {
//   const id = parseInt(value, 10);

//   const queryBuilder = this.customerRepository.createQueryBuilder('customer');

//   if (!isNaN(id)) {
//     queryBuilder.where('customer.id = :id', { id });
//   } else {
//     queryBuilder.where('customer.name LIKE :value', { value: `%${value}%` })
//       .orWhere('customer.email LIKE :value', { value: `%${value}%` })
//       .orWhere('customer.address LIKE :value', { value: `%${value}%` });
//   }

 
//   const [data, total] = await queryBuilder
//     .orderBy('customer.id', 'DESC')
//     .skip((page - 1) * limit)
//     .take(limit)
//     .getManyAndCount();

//   if (total === 0) {
//     throw new NotFoundException(`No customers found matching "${value}"`);
//   }

// return {
//     statusCode: 200,
//     message: `Found ${total} customer(s) matching "${value}"`,
//     data,
//     total,
 
//   };
// }
  async delete(id: number): Promise<{ statusCode: number; message: string }> {
  const customer = await this.customerRepository.findOne({ where: { id } });

  if (!customer) {
    throw new NotFoundException(`Customer with ID ${id} not found`);
  }

  try {
    await this.customerRepository.delete(id);

    return {
      statusCode: 200,
      message: `Customer with ID ${id} has been deleted successfully.`,
    };
  } catch (error) {
    if (error.code === '23503') {
      // Foreign key violation
      return {
        statusCode: 400,
        message: `Customer with ID ${id} cannot be deleted because it is linked to other records.`,
      };
    }

 
    throw error;
  }
}
  async findAll(page = 1): Promise<{ statusCode: number; message: string; data: Customer[]; total: number; page: number }> {
        const take = 10;
        const skip = (page - 1) * take;
      
        const [data, total] = await this.customerRepository.findAndCount({
          take,
          skip,
          relations: ['location'], 
          order: { id: 'DESC' },
        });
      
        return {
           statusCode: 200,
           message:'Customers retrieved successfully',
          data,
          total,
          page,
        };
}    

async findByFilters(
  filters: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    contact_person?: string;
    company_code?: string;
    location_id?: number;
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: Customer[];
  total: number;
  page: number;
}> {
  const parsedLocationId = Number(filters.location_id);

 if (!parsedLocationId || isNaN(parsedLocationId)) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be a valid number',
      data: [],
      total: 0,
      page,
    };
  }

  const query = this.customerRepository.createQueryBuilder('customer')
  .leftJoinAndSelect('customer.location', 'location')
       .leftJoinAndSelect('customer.creator', 'creator')
    .leftJoinAndSelect('customer.updator', 'updator');
  let hasValidFilter = false;
 query.andWhere('customer.location_id = :location_id', {
    location_id: filters.location_id,
  });
  if (filters.id !== undefined && filters.id !== null && !isNaN(Number(filters.id))) {
    query.andWhere('customer.id = :id', { id: filters.id });
    hasValidFilter = true;
  }
  if (filters.name && filters.name.trim() !== '') {
    query.andWhere('LOWER(customer.name) LIKE LOWER(:name)', { name: `%${filters.name.trim()}%` });
    hasValidFilter = true;
  }
  if (filters.email && filters.email.trim() !== '') {
    query.andWhere('LOWER(customer.email) LIKE LOWER(:email)', { email: `%${filters.email.trim()}%` });
    hasValidFilter = true;
  }
  if (filters.phone && filters.phone.trim() !== '') {
    query.andWhere('customer.phone LIKE :phone', { phone: `%${filters.phone.trim()}%` });
    hasValidFilter = true;
  }
  if (filters.address && filters.address.trim() !== '') {
    query.andWhere('LOWER(customer.address) LIKE LOWER(:address)', { address: `%${filters.address.trim()}%` });
    hasValidFilter = true;
  }
  if (filters.city && filters.city.trim() !== '') {
    query.andWhere('LOWER(customer.city) LIKE LOWER(:city)', { city: `%${filters.city.trim()}%` });
    hasValidFilter = true;
  }
  if (filters.state && filters.state.trim() !== '') {
    query.andWhere('LOWER(customer.state) LIKE LOWER(:state)', { state: `%${filters.state.trim()}%` });
    hasValidFilter = true;
  }
  if (filters.country && filters.country.trim() !== '') {
    query.andWhere('LOWER(customer.country) LIKE LOWER(:country)', { country: `%${filters.country.trim()}%` });
    hasValidFilter = true;
  }
  if (filters.contact_person && filters.contact_person.trim() !== '') {
    query.andWhere('LOWER(customer.contact_person) LIKE LOWER(:contact_person)', {
      contact_person: `%${filters.contact_person.trim()}%`,
    });
    hasValidFilter = true;
  }
  if (filters.company_code && filters.company_code.trim() !== '') {
    query.andWhere('LOWER(customer.company_code) LIKE LOWER(:company_code)', {
      company_code: `%${filters.company_code.trim()}%`,
    });
    hasValidFilter = true;
  }
    if (filters.location_id !== undefined && !isNaN(Number(filters.location_id))) {
    query.andWhere('location.id = :location_id', { location_id: filters.location_id }); // ✅ Add location_id condition
    hasValidFilter = true;
  }

  
  if (!hasValidFilter) {
    return {
      statusCode: 400,
      message: 'At least one valid filter must be provided.',
      data: [],
      total: 0,
      page,
    };
  }

  const [data, total] = await query
    .orderBy('customer.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0
      ? 'Customers retrieved successfully'
      : 'No customers found matching the criteria',
    data,
    total,
    page,
  };
}

async searchWithPagination(
  body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
    location_id?: number;
  },
): Promise<{
  statusCode: number;
  message: string;
  data: {
    customers: Customer[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const { Page, PageSize, StartDate, EndDate, Search ,location_id} = body;
  const page = Page || 1;
  const limit = PageSize || 10;
  const skip = (page - 1) * limit;

  const query = this.customerRepository.createQueryBuilder('customer') 
  .leftJoinAndSelect('customer.location', 'location')
       .leftJoinAndSelect('customer.creator', 'creator')
    .leftJoinAndSelect('customer.updator', 'updator');

  // 🔍 Case-insensitive search
  if (Search) {
    const search = `%${Search.toLowerCase()}%`;
    query.andWhere(
      `(LOWER(customer.name) LIKE :search OR LOWER(customer.email) LIKE :search OR LOWER(customer.phone) LIKE :search OR LOWER(customer.company_code) LIKE :search)`,
      { search },
    );
  }

   if (!location_id || location_id <= 0) {
    return {
      statusCode: 400,
      message: 'Location_id is required and must be a valid number',
      data: {
        customers: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  // 📅 Timestamp-based date filtering
  if (StartDate && EndDate) {
    const start = new Date(StartDate);
    const end = new Date(EndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: {
          customers: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    query.andWhere('customer.created_at BETWEEN :start AND :end', {
      start: start.toISOString(),
      end: end.toISOString(),
    });
  }

   if (location_id) {
    query.andWhere('location.id = :location_id', { location_id: location_id });
  }
  const [customers, total] = await query
    .orderBy('customer.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Customers retrieved successfully' : 'No customers found',
    data: {
      customers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async updateStatus(
  id: number,
): Promise<{ statusCode: number; message: string; data: Customer | null }> {
  const customer = await this.customerRepository.findOne({ where: { id } });

  if (!customer) {
    return {
      statusCode: 404,
      message: `Customer with ID ${id} not found`,
      data: null,
    };
  }

  // Toggle is_active
  customer.is_active = !customer.is_active;

  const updated = await this.customerRepository.save(customer);

  return {
    statusCode: 200,
    message: `${updated.is_active ? 'Active' : 'Inactive'}`,
    data: updated,
  };
}


//   async findOne(id: number): Promise<Customer> {
//         const customer = await this.customerRepository.findOne({ where: { id } });
    
//         if (!customer) {
//           throw new NotFoundException(`Customer with ID ${id} not found`);
//         }
    
//         return customer;
// }  
}
