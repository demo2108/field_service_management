import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactPerson } from './entities/contact_per.entity';
import { Repository } from 'typeorm';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { UpdateContactPersonDto } from './dto/update-contact-person.dto';
import { Branch } from 'src/branch/entities/branch.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ContactPersonService {
      constructor(
    @InjectRepository(ContactPerson)
    private readonly contactPersonRepo: Repository<ContactPerson>,
           @InjectRepository(User)
          private readonly userRepository: Repository<User>,
  ) {}
// async create(dto: CreateContactPersonDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: ContactPerson | null;
// }> {
//   const existing = await this.contactPersonRepo.findOne({
//     where: { phone: dto.phone },
//   });

//   if (existing) {
//     return {
//       statusCode: 400,
//       message: 'Phone number already exists.',
//       data: null,
//     };
//   }

//   const contactPerson = this.contactPersonRepo.create({
//     ...dto,
//     branch: { id: dto.branchId },
//   });

//   const saved = await this.contactPersonRepo.save(contactPerson);

//   return {
//     statusCode: 201,
//     message: 'Contact person created successfully',
//     data: saved,
//   };
// }
async create(dto: CreateContactPersonDto): Promise<{
  statusCode: number;
  message: string;
  data: ContactPerson | null;
}> {
  const existing = await this.contactPersonRepo.findOne({
    where: { phone: dto.phone },
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
      message: 'Phone number already exists.',
      data: null,
    };
  }

  const contactPerson = this.contactPersonRepo.create({
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    designation: dto.designation,
    branch: { id: dto.branchId },
    location: dto.location_id ? { id: dto.location_id } : undefined,
    creator,
  });

  const saved = await this.contactPersonRepo.save(contactPerson);

  // 🔁 Reload with full relation objects (location and branch if needed)
  const withRelations = await this.contactPersonRepo.findOne({
    where: { id: saved.id },
    relations: ['location','creator'], // add 'branch' if you also want full branch details
  });

  return {
    statusCode: 201,
    message: 'Contact person created successfully',
    data: withRelations,
  };
}
async findAll(page = 1): Promise<{
  statusCode: number;
  message: string;
  data: { contactPersons: ContactPerson[]; total: number; page: number };
}> {
  const take = 10;
  const skip = (page - 1) * take;

  const [contactPersons, total] = await this.contactPersonRepo.findAndCount({
    take,
    skip,
      relations: ['location'],
    order: { id: 'DESC' },
  });

  return {
    statusCode: 200,
    message: total > 0 ? 'Contact persons retrieved successfully' : 'No contact persons found',
    data: {
      contactPersons,
      total,
      page,
    },
  };
}
// async findByFilters(
//   filters: {
//     id?: number;
//     branchId?: number;
//     branchName?: string;
//     name?: string;
//     email?: string;
//     designation?: string;
//   },
//   page = 1,
//   limit = 10,
// ): Promise<{
//   statusCode: number;
//   message: string;
//   data: { contactPersons: ContactPerson[]; total: number; page: number };
// }> {
//   const query = this.contactPersonRepo.createQueryBuilder('cp')
//     .leftJoinAndSelect('cp.branch', 'branch');

//   if (filters.id != null) {
//     query.andWhere('cp.id = :id', { id: filters.id });
//   }

//   if (filters.name) {
//     query.andWhere('cp.name ILIKE :name', { name: `%${filters.name}%` });
//   }

//   if (filters.email) {
//     query.andWhere('cp.email ILIKE :email', { email: `%${filters.email}%` });
//   }

//   if (filters.designation) {
//     query.andWhere('cp.designation ILIKE :designation', { designation: `%${filters.designation}%` });
//   }

//   if (filters.branchId != null) {
//     query.andWhere('branch.id = :branchId', { branchId: filters.branchId });
//   }

//   if (filters.branchName) {
//     query.andWhere('branch.branch_name ILIKE :branchName', { branchName: `%${filters.branchName}%` });
//   }

//   const [contactPersons, total] = await query
//     .orderBy('cp.id', 'DESC')
//     .skip((page - 1) * limit)
//     .take(limit)
//     .getManyAndCount();

//   return {
//     statusCode: 200,
//     message: total > 0
//       ? 'Contact persons retrieved successfully'
//       : 'No contact persons found matching the filters',
//     data: {
//       contactPersons,
//       total,
//       page,
//     },
//   };
// } 
async findByFilters(
  filters: {
    id?: number;
    branchId?: number;
    branchName?: string;
    name?: string;
    email?: string;
    designation?: string;
     location_id?: number; 
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: { contactPersons: ContactPerson[]; total: number; page: number };
}> {

    if (!filters.location_id || isNaN(filters.location_id)) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be a valid number',
      data: {
        contactPersons: [],
        total: 0,
        page,
       
      },
    };
  }
  const query = this.contactPersonRepo.createQueryBuilder('cp')
    .leftJoinAndSelect('cp.branch', 'branch')
        .leftJoinAndSelect('cp.location', 'location')
             .leftJoinAndSelect('cp.creator', 'creator')
      .leftJoinAndSelect('cp.updator', 'updator');

  let hasValidFilter = false;
  query.andWhere('cp.location_id = :location_id', {
    location_id: filters.location_id,
  });
  if (filters.id !== undefined && filters.id !== null && !isNaN(Number(filters.id))) {
    query.andWhere('cp.id = :id', { id: filters.id });
    hasValidFilter = true;
  }

  if (filters.name && filters.name.trim() !== '') {
    query.andWhere('cp.name ILIKE :name', { name: `%${filters.name.trim()}%` });
    hasValidFilter = true;
  }

  if (filters.email && filters.email.trim() !== '') {
    query.andWhere('cp.email ILIKE :email', { email: `%${filters.email.trim()}%` });
    hasValidFilter = true;
  }

  if (filters.designation && filters.designation.trim() !== '') {
    query.andWhere('cp.designation ILIKE :designation', { designation: `%${filters.designation.trim()}%` });
    hasValidFilter = true;
  }

  if (filters.branchId !== undefined && filters.branchId !== null && !isNaN(Number(filters.branchId))) {
    query.andWhere('branch.id = :branchId', { branchId: filters.branchId });
    hasValidFilter = true;
  }

  if (filters.branchName && filters.branchName.trim() !== '') {
    query.andWhere('branch.branch_name ILIKE :branchName', { branchName: `%${filters.branchName.trim()}%` });
    hasValidFilter = true;
  }
  if (filters.location_id !== undefined && !isNaN(Number(filters.location_id))) {
    query.andWhere('location.id = :location_id', { location_id: filters.location_id });
    hasValidFilter = true;
  }
  
  if (!hasValidFilter) {
    return {
      statusCode: 400,
      message: 'At least one valid filter must be provided.',
      data: { contactPersons: [], total: 0, page },
    };
  }

  const [contactPersons, total] = await query
    .orderBy('cp.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0
      ? 'Contact persons retrieved successfully'
      : 'No contact persons found matching the filters',
    data: {
      contactPersons,
      total,
      page,
    },
  };
}

async findByBranchId(
  branchId: number,
): Promise<{
  statusCode: number;
  message: string;
  data: ContactPerson[];
}> {
  const contactPersons = await this.contactPersonRepo.find({
    where: { branch: { id: branchId } },
    relations: ['branch','location'],
    order: { id: 'DESC' },
  });

  return {
    statusCode: 200,
    message:
      contactPersons.length > 0
        ? `Contact persons for branch ID ${branchId} retrieved successfully`
        : `No contact persons found for branch ID ${branchId}`,
    data: contactPersons,
  };
}
async findOne(id: number): Promise<{
  statusCode: number;
  message: string;
  data: ContactPerson;
}> {
  const contact = await this.contactPersonRepo.findOne({
    where: { id },
    relations: ['branch',''],
  });

  if (!contact) {
    throw new NotFoundException(`ContactPerson with ID ${id} not found.`);
  }

  return {
    statusCode: 200,
    message: `ContactPerson with ID ${id} retrieved successfully.`,
    data: contact,
  };
}

async update(
  id: number,
  dto: UpdateContactPersonDto,
): Promise<{
  statusCode: number;
  message: string;
  data: ContactPerson | null;
}> {
  if (!dto.updated_by || typeof dto.updated_by !== 'number') {
    return {
      statusCode: 400,
      message: '`updated_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }

  const contact = await this.contactPersonRepo.findOne({
    where: { id },
    relations: ['branch', 'updator'],
  });

  if (!contact) {
    throw new NotFoundException(`ContactPerson with ID ${id} not found.`);
  }

  // Check for phone uniqueness
  if (dto.phone && dto.phone !== contact.phone) {
    const existing = await this.contactPersonRepo.findOne({
      where: { phone: dto.phone },
    });

    if (existing && existing.id !== id) {
      throw new BadRequestException('Phone number already exists.');
    }
  }

  // ✅ Validate updated_by user
  const updator = await this.userRepository.findOne({ where: { id: dto.updated_by } });
  if (!updator) {
    return {
      statusCode: 404,
      message: `User with ID ${dto.updated_by} not found`,
      data: null,
    };
  }

  // Assign branch if updated
  if (dto.branchId) {
    contact.branch = { id: dto.branchId } as any;
  }

  // Assign location if updated
  if (dto.location_id !== undefined) {
    contact.location = dto.location_id ? ({ id: dto.location_id } as any) : null;
  }

  // Assign other fields
  Object.assign(contact, dto);

  // ✅ Set updator relation and timestamp
  contact.updator = updator;
  contact.updated_at = new Date();

  await this.contactPersonRepo.save(contact);

  // ✅ Reload full entity with all relations
  const withRelations = await this.contactPersonRepo.findOne({
    where: { id },
    relations: ['location', 'branch', 'updator'],
  });

  if (!withRelations) {
    throw new NotFoundException(`Updated ContactPerson with ID ${id} not found.`);
  }

  return {
    statusCode: 200,
    message: `ContactPerson with ID ${id} updated successfully.`,
    data: withRelations,
  };
}


async remove(id: number): Promise<{
  statusCode: number;
  message: string;
}> {
  try {
    const result = await this.contactPersonRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Contact person with ID ${id} not found`);
    }

    return {
      statusCode: 200,
      message: `Contact person with ID ${id} deleted successfully.`,
    };
  } catch (error) {
    if (error.code === '23503') {
      
      return {
        statusCode: 400,
        message: `Contact person with ID ${id} cannot be deleted because it is linked to other records.`,
      };
    }

    throw error;
  }
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
    contactPersons: ContactPerson[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
   const { Page, PageSize, StartDate, EndDate, Search, BranchId,location_id } = body;
  const page = body.Page || 1;
  const limit = body.PageSize || 10;
  const skip = (page - 1) * limit;

    if (!location_id || location_id <= 0) {
    return {
      statusCode: 400,
      message: 'Location_id is required and must be a valid number',
      data: {
        contactPersons: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  const query = this.contactPersonRepo.createQueryBuilder('cp')
    .leftJoinAndSelect('cp.branch', 'branch')
      .leftJoinAndSelect('cp.location', 'location')
       .leftJoinAndSelect('cp.creator', 'creator')
    .leftJoinAndSelect('cp.updator', 'updator');

  // 🔍 Search filter
  if (body.Search) {
    const search = `%${body.Search}%`;
    query.andWhere(
      `(cp.name ILIKE :search OR cp.email ILIKE :search OR cp.designation ILIKE :search OR cp.phone ILIKE :search)`,
      { search },
    );
  }

  // 🏢 Branch ID filter
  if (body.BranchId) {
    query.andWhere('branch.id = :branchId', { branchId: body.BranchId });
  }

   if (location_id) {
    query.andWhere('location.id = :location_id', { location_id: location_id });
  }
  // 📅 Timestamp-based filtering (created_at)
  if (body.StartDate && body.EndDate) {
    const start = new Date(body.StartDate);
    const end = new Date(body.EndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: {
          contactPersons: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    query.andWhere('cp.created_at BETWEEN :startDate AND :endDate', {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }

  // 📦 Execute query
  const [contactPersons, total] = await query
    .orderBy('cp.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Search results found' : 'No results found',
    data: {
      contactPersons,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
async updateStatus(
  id: number,
): Promise<{ statusCode: number; message: string; data: ContactPerson | null }> {
  const contactPerson = await this.contactPersonRepo.findOne({ where: { id } });

  if (!contactPerson) {
    return {
      statusCode: 404,
      message: `Contact person with ID ${id} not found`,
      data: null,
    };
  }

  // Toggle is_active (assumes you have this column in your entity)
  contactPerson.is_active = !contactPerson.is_active;

  const updated = await this.contactPersonRepo.save(contactPerson);

  return {
    statusCode: 200,
    message: `Contact person is now ${updated.is_active ? 'Active' : 'Inactive'}`,
    data: updated,
  };
}

}

