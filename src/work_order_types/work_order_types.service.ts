import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkOrderType } from './entities/work-order-type.entity';
import { Not, Repository } from 'typeorm';
import { CreateWorkOrderTypeDto } from './dto/create-work-order-type.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateWorkOrderTypeDto } from './dto/update-work-order-type.dto';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class WorkOrderTypesService {
    constructor(
    @InjectRepository(WorkOrderType)
    private readonly workOrderTypeRepo: Repository<WorkOrderType>,
    @InjectRepository(LocationMaster)
    private readonly locationRepository: Repository<LocationMaster>,
            @InjectRepository(User)
      private readonly userRepository: Repository<User>,    
  ) {}
async create(dto: CreateWorkOrderTypeDto): Promise<{
  statusCode: number;
  message: string;
  data?: any;
}> {
  const instance = plainToInstance(CreateWorkOrderTypeDto, dto);
  const errors = await validate(instance);

  if (errors.length > 0) {
    const errorMessages = errors
      .map(err => Object.values(err.constraints || {}).join(', '))
      .join('; ');

    return {
      statusCode: 400,
      message: `Validation failed: ${errorMessages}`,
    };
  }
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
const existingType = await this.workOrderTypeRepo.findOne({
    where: { type: dto.type },
  });

  if (existingType) {
    return {
      statusCode: 409, // Conflict
      message: `Work Order Type '${dto.type}' already exists.`,
      data: null,
    };
  }
    const newType = this.workOrderTypeRepo.create({
    ...dto,
    creator, 
  });
  const saved = await this.workOrderTypeRepo.save(newType);

  const full = await this.workOrderTypeRepo.findOne({
    where: { id: saved.id },
    relations: ['location','creator'], 
  });

  return {
    statusCode: 201,
    message: 'Work Order Type created successfully',
    data: full,
  };
}
// async update(
//   id: number,
//   dto: UpdateWorkOrderTypeDto,
// ): Promise<{ statusCode: number; message: string; data?: any }> {
//   const workOrderType = await this.workOrderTypeRepo.findOne({ where: { id } });

//   if (!workOrderType) {
//     return {
//       statusCode: 404,
//       message: `Work Order Type with ID ${id} not found`,
//     };
//   }

//   // Manual validation
//   const instance = plainToInstance(UpdateWorkOrderTypeDto, dto);
//   const errors = await validate(instance);
//   if (errors.length > 0) {
//     const errorMessages = errors
//       .map(err => Object.values(err.constraints || {}).join(', '))
//       .join('; ');

//     return {
//       statusCode: 400,
//       message: `Validation failed: ${errorMessages}`,
//     };
//   }

//   Object.assign(workOrderType, dto);

//   const updated = await this.workOrderTypeRepo.save(workOrderType);

//   return {
//     statusCode: 200,
//     message: 'Work Order Type updated successfully',
//     data: updated,
//   };
// }
async update(
  id: number,
  dto: UpdateWorkOrderTypeDto,
): Promise<{ statusCode: number; message: string; data?: any }> {
  const workOrderType = await this.workOrderTypeRepo.findOne({ where: { id } });

  if (!workOrderType) {
    return {
      statusCode: 404,
      message: `Work Order Type with ID ${id} not found`,
    };
  }
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
  // ✅ Manually enforce location_id presence
  if (!dto.location_id) {
    return {
      statusCode: 400,
      message: 'location_id is required for update',
    };
  }

  // Manual validation
  const instance = plainToInstance(UpdateWorkOrderTypeDto, dto);
  const errors = await validate(instance);
  if (errors.length > 0) {
    const errorMessages = errors
      .map(err => Object.values(err.constraints || {}).join(', '))
      .join('; ');

    return {
      statusCode: 400,
      message: `Validation failed: ${errorMessages}`,
    };
  }
const existingType = await this.workOrderTypeRepo.findOne({
  where: {
    type: dto.type,
    id: Not(id),
  },
});
if (dto.sla && typeof dto.sla === 'string') {
  const [hours, minutes] = dto.sla.split(':').map(Number);
  if (!isNaN(hours) && !isNaN(minutes)) {
    dto.sla = `${hours} hours ${minutes} minutes`;
  } else {
    return {
      statusCode: 400,
      message: 'Invalid SLA format. Expected format is "HH:MM".',
    };
  }
}
if (existingType) {
  return {
    statusCode: 409,
    message: `Work Order Type '${dto.type}' already exists.`,
    
    data: null,
  };
}
  Object.assign(workOrderType, dto);
  const updated = await this.workOrderTypeRepo.save(workOrderType);

  const full = await this.workOrderTypeRepo.findOne({
    where: { id: updated.id },
    relations: ['location', 'updator'],
  });
if (full?.sla) {
    const match = /(?<hours>\d+)\s+hours\s+(?<minutes>\d+)\s+minutes/.exec(full.sla as any);
    if (match?.groups) {
      const formattedSla = `${String(match.groups.hours).padStart(2, '0')}:${String(match.groups.minutes).padStart(2, '0')}`;
      (full as any).sla = formattedSla;
    }
  }
  return {
    statusCode: 200,
    message: 'Work Order Type updated successfully',
    data: full,
  };
}
async delete(id: number): Promise<{ statusCode: number; message: string }> {
  try {
    const result = await this.workOrderTypeRepo.delete(id);

    if (result.affected === 0) {
      return {
        statusCode: 404,
        message: `Work Order Type with ID ${id} not found`,
      };
    }

    return {
      statusCode: 200,
      message: `Work Order Type with ID ${id} deleted successfully`,
    };
  } catch (error) {
    if (error.code === '23503') {
      return {
        statusCode: 400,
        message: `Work Order Type with ID ${id} cannot be deleted because it is linked to other records.`,
      };
    }

    // Re-throw other unexpected errors
    throw error;
  }
}
async findAll(page = 1): Promise<{
  statusCode: number;
  message: string;
  data: {
    workOrderTypes: WorkOrderType[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const take = 10;
  const skip = (page - 1) * take;

  const [workOrderTypes, total] = await this.workOrderTypeRepo.findAndCount({
    take,
    skip,
    relations: ['location'],
    order: { id: 'DESC' },
  });

  return {
    statusCode: 200,
    message: total > 0 ? 'Work Order Types retrieved successfully.' : 'No Work Order Types found.',
    data: {
      workOrderTypes,
      total,
      page,
      totalPages: Math.ceil(total / take),
    },
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
    workOrderTypes: WorkOrderType[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
   const { Page, PageSize, StartDate, EndDate, Search,BranchId, location_id } = body;
  const page = body.Page || 1;
  const limit = body.PageSize || 10;
  const skip = (page - 1) * limit;
   if (!location_id || location_id <= 0) {
    return {
      statusCode: 400,
      message: 'Location_id is required and must be a valid number',
      data: {
        workOrderTypes: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  const query = this.workOrderTypeRepo.createQueryBuilder('type')
  .leftJoinAndSelect('type.location', 'location')
   .leftJoinAndSelect('type.creator', 'creator')
    .leftJoinAndSelect('type.updator', 'updator');

  // Optional Search filter
  if (body.Search) {
    const keyword = `%${body.Search.toLowerCase()}%`;
    query.andWhere(
      `LOWER(type.type) LIKE :keyword OR LOWER(type.capacity) LIKE :keyword OR LOWER(type.height) LIKE :keyword OR LOWER(type.width) LIKE :keyword`,
      { keyword }
    );
  }
  if (location_id) {
    query.andWhere('location.id = :location_id', { location_id: location_id });
  }
  // Optional Date Filter using created_at
  if (body.StartDate && body.EndDate) {
    const start = new Date(body.StartDate);
    const end = new Date(body.EndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: {
          workOrderTypes: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    query.andWhere('type.created_at BETWEEN :startDate AND :endDate', {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }

  const [workOrderTypes, total] = await query
    .orderBy('type.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Search results found' : 'No matching work order types found',
    data: {
      workOrderTypes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
async updateStatus(id: number): Promise<{
  statusCode: number;
  message: string;
  data: WorkOrderType | null;
}> {
  const record = await this.workOrderTypeRepo.findOne({ where: { id } });

  if (!record) {
    return {
      statusCode: 404,
      message: `Work Order Type with ID ${id} not found`,
      data: null,
    };
  }

  // Toggle is_active status
  record.is_active = !record.is_active;

  const updated = await this.workOrderTypeRepo.save(record);

  return {
    statusCode: 200,
    message: `Work Order Type with ID ${id} has been marked as ${updated.is_active ? 'Active' : 'Inactive'}`,
    data: updated,
  };
}
async findByFilters(
  filters: {
    id?: number;
    type?: string;
    capacity?: string;
    height?: string;
    width?: string;
    no_of_loadshell?: number;
    is_active?: boolean;
      location_id?: number;
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: {
    workOrderTypes: WorkOrderType[];
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
        workOrderTypes: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  try {
    const query = this.workOrderTypeRepo.createQueryBuilder('wot')
    .leftJoinAndSelect('wot.location', 'location')
       .leftJoinAndSelect('wot.creator', 'creator')
    .leftJoinAndSelect('wot.updator', 'updator');
    let hasValidFilter = false;


      query.andWhere('wot.location_id = :location_id', {
    location_id: filters.location_id,
  });
    if (filters.id != null && !isNaN(Number(filters.id))) {
      query.andWhere('wot.id = :id', { id: filters.id });
      hasValidFilter = true;
    }

    if (filters.type?.trim()) {
      query.andWhere('LOWER(wot.type) LIKE LOWER(:type)', { type: `%${filters.type.trim()}%` });
      hasValidFilter = true;
    }

    if (filters.capacity?.trim()) {
      query.andWhere('LOWER(wot.capacity) LIKE LOWER(:capacity)', { capacity: `%${filters.capacity.trim()}%` });
      hasValidFilter = true;
    }

    if (filters.height?.trim()) {
      query.andWhere('LOWER(wot.height) LIKE LOWER(:height)', { height: `%${filters.height.trim()}%` });
      hasValidFilter = true;
    }

    if (filters.width?.trim()) {
      query.andWhere('LOWER(wot.width) LIKE LOWER(:width)', { width: `%${filters.width.trim()}%` });
      hasValidFilter = true;
    }

    if (filters.no_of_loadshell != null && !isNaN(Number(filters.no_of_loadshell))) {
      query.andWhere('wot.no_of_loadshell = :no_of_loadshell', { no_of_loadshell: filters.no_of_loadshell });
      hasValidFilter = true;
    }

    if (filters.is_active != null) {
      query.andWhere('wot.is_active = :is_active', { is_active: filters.is_active });
      hasValidFilter = true;
    }

    // If no filters provided
    if (!hasValidFilter) {
      return {
        statusCode: 400,
        message: 'At least one valid filter must be provided.',
        data: {
          workOrderTypes: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    const [workOrderTypes, total] = await query
      .orderBy('wot.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      statusCode: 200,
      message: total > 0 ? 'Work order types retrieved successfully.' : 'No matching work order types found.',
      data: {
        workOrderTypes,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error in findByFilters (WorkOrderType):', error);
    return {
      statusCode: 500,
      message: 'An error occurred while filtering work order types.',
      data: {
        workOrderTypes: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
}
}
