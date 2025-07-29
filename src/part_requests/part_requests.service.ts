import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePartRequestDto } from './dto/update-part-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartRequest } from './entities/part-request.entity';
import { Repository } from 'typeorm';
import { CreatePartRequestDto } from './dto/create-part-request.dto';

@Injectable()
export class PartRequestsService {
    constructor(
    @InjectRepository(PartRequest)
    private readonly partRequestRepository: Repository<PartRequest>,
  ) {}
async create(dto: CreatePartRequestDto): Promise<{
  statusCode: number;
  message: string;
  data: PartRequest;
}> {
  console.log('DTO:', dto);

  const newRequest = this.partRequestRepository.create(dto);
  const saved = await this.partRequestRepository.save(newRequest);

  console.log('Saved:', saved);

  const savedWithRelations = await this.partRequestRepository.findOneOrFail({
    where: { id: saved.id },
    relations: ['creator', 'product','engineer'],
  });

  console.log('With relations:', savedWithRelations);

  return {
    statusCode: 201,
    message: 'Part request created successfully',
    data: savedWithRelations,
  };
}



// async create(dto: CreatePartRequestDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: PartRequest;
// }> {
//   const newRequest = this.partRequestRepository.create(dto);
//   const saved = await this.partRequestRepository.save(newRequest);

//   return {
//     statusCode: 201,
//     message: 'Part request created successfully',
//     data: saved,
//   };
// }
async findAll(page = 1): Promise<{
  statusCode: number;
  message: string;
  data: {
    requests: PartRequest[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const take = 10;
  const skip = (page - 1) * take;

  const [requests, total] = await this.partRequestRepository.findAndCount({
    take,
    skip,
    order: { id: 'DESC' },
  });

  return {
    statusCode: 200,
    message: total > 0 ? 'Part requests retrieved successfully' : 'No part requests found',
    data: {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / take),
    },
  };
}
async findByFilters(
  filters: {
    id?: number;
    work_order_id?: number;
    engineer_id?: number;
    part_name?: string;
    quantity?: number;
    request_status?: string;
    approved_by?: number;
    request_date?: string;
    approval_date?: string;
    location_id?: number;
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: {
    requests: PartRequest[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  // 🔒 Required filter check
  if (!filters.location_id || filters.location_id <= 0) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be a valid number',
      data: { requests: [], total: 0, page, totalPages: 0 },
    };
  }

  const query = this.partRequestRepository
    .createQueryBuilder('pr')
    .leftJoinAndSelect('pr.workOrder', 'workOrder')
    .leftJoinAndSelect('pr.location', 'location')
    .leftJoinAndSelect('pr.creator', 'creator')
    .leftJoinAndSelect('pr.updator', 'updator'); // Ensure this relation exists

  // 🔍 Dynamic Filters

  if (filters.id !== undefined) {
    if (!Number.isInteger(filters.id)) {
      return {
        statusCode: 400,
        message: 'Invalid value for "id" filter',
        data: { requests: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('pr.id = :id', { id: filters.id });
  }

  if (filters.location_id !== undefined) {
    query.andWhere('pr.location_id = :location_id', {
      location_id: filters.location_id,
    });
  }

  if (filters.work_order_id !== undefined) {
    if (!Number.isInteger(filters.work_order_id)) {
      return {
        statusCode: 400,
        message: 'Invalid work_order_id',
        data: { requests: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('pr.work_order_id = :work_order_id', {
      work_order_id: filters.work_order_id,
    });
  }

  if (filters.engineer_id !== undefined) {
    query.andWhere('pr.engineer_id = :engineer_id', {
      engineer_id: filters.engineer_id,
    });
  }

  if (filters.part_name !== undefined) {
    const val = filters.part_name.trim();
    if (val === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "part_name" filter',
        data: { requests: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('pr.part_name ILIKE :part_name', {
      part_name: `%${val}%`,
    });
  }

  if (filters.quantity !== undefined) {
    if (!Number.isInteger(filters.quantity)) {
      return {
        statusCode: 400,
        message: 'Invalid value for "quantity" filter',
        data: { requests: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('pr.quantity = :quantity', { quantity: filters.quantity });
  }

  if (filters.request_status !== undefined) {
    const val = filters.request_status.trim();
    if (val === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "request_status" filter',
        data: { requests: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('pr.request_status ILIKE :request_status', {
      request_status: `%${val}%`,
    });
  }

  if (filters.approved_by !== undefined) {
    query.andWhere('pr.approved_by = :approved_by', {
      approved_by: filters.approved_by,
    });
  }

  if (filters.request_date !== undefined) {
    const val = filters.request_date.trim();
    if (val === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "request_date" filter',
        data: { requests: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('CAST(pr.request_date AS TEXT) ILIKE :request_date', {
      request_date: `%${val}%`,
    });
  }

  if (filters.approval_date !== undefined) {
    const val = filters.approval_date.trim();
    if (val === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "approval_date" filter',
        data: { requests: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('CAST(pr.approval_date AS TEXT) ILIKE :approval_date', {
      approval_date: `%${val}%`,
    });
  }

  // 📄 Execute paginated result
  const [requests, total] = await query
    .orderBy('pr.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message:
      total > 0
        ? 'Filtered part requests retrieved successfully'
        : 'No part requests found for the given filters',
    data: {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
async findOne(id: number): Promise<PartRequest> {
    const partRequest = await this.partRequestRepository.findOne({ where: { id } });
    if (!partRequest) {
      throw new NotFoundException(`PartRequest with ID ${id} not found`);
    }
    return partRequest;
}
// async update(id: number, dto: UpdatePartRequestDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: PartRequest | null;
// }> {
//   const partRequest = await this.findOne(id);

//   if (!partRequest) {
//     return {
//       statusCode: 404,
//       message: `Part request with ID ${id} not found`,
//       data: null,
//     };
//   }

//   const updated = Object.assign(partRequest, dto);
//   const saved = await this.partRequestRepository.save(updated);

//   return {
//     statusCode: 200,
//     message: 'Part request updated successfully',
//     data: saved,
//   };
// }
async update(id: number, dto: UpdatePartRequestDto): Promise<{
  statusCode: number;
  message: string;
  data: PartRequest | null;
}> {
  const partRequest = await this.findOne(id);

  if (!partRequest) {
    return {
      statusCode: 404,
      message: `Part request with ID ${id} not found`,
      data: null,
    };
  }

  const updated = Object.assign(partRequest, dto);
  await this.partRequestRepository.save(updated);

  // 👇 Re-fetch with relations
  const updatedWithRelations = await this.partRequestRepository.findOne({
    where: { id },
    relations: ['creator', 'product', 'engineer'], // add more if needed
  });

  return {
    statusCode: 200,
    message: 'Part request updated successfully',
    data: updatedWithRelations,
  };
}

async remove(id: number): Promise<{
  statusCode: number;
  message: string;
}> {
  const partRequest = await this.findOne(id);

  if (!partRequest) {
    return {
      statusCode: 404,
      message: `Part request with ID ${id} not found`,
    };
  }

  await this.partRequestRepository.remove(partRequest);

  return {
    statusCode: 200,
    message: 'Part request deleted successfully',
  };
}
async searchWithPagination(body: {
  Page: number;
  PageSize: number;
  StartDate?: string;
  EndDate?: string;
  Search?: string;
  Work_order_id?: number;
  location_id?: number;
}): Promise<{
  statusCode: number;
  message: string;
  data: {
    partRequests: PartRequest[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const { Page = 1, PageSize = 10, StartDate, EndDate, Search, Work_order_id, location_id } = body;

  const page = Page;
  const limit = PageSize;
  const skip = (page - 1) * limit;

  // Validate location_id
  if (!location_id || location_id <= 0) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be a valid number',
      data: {
        partRequests: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }

  const query = this.partRequestRepository
    .createQueryBuilder('pr')
    .leftJoinAndSelect('pr.workOrder', 'workOrder')
      .leftJoinAndSelect('pr.engineer', 'engineer') 
         .leftJoinAndSelect('pr.product', 'product') 
            .leftJoinAndSelect('pr.creator', 'creator')
    .leftJoinAndSelect('pr.updator', 'updator')
    .where('pr.location_id = :location_id', { location_id });

  // 🔍 Search by part_name (optional)
  if (Search && Search.trim() !== '') {
    const keyword = `%${Search.toLowerCase()}%`;
    query.andWhere(`LOWER(pr.part_name) LIKE :keyword`, { keyword });
  }

  // 🔍 Filter by Work_order_id (optional)
  if (Work_order_id) {
    query.andWhere('pr.work_order_id = :Work_order_id', { Work_order_id });
  }

  // 📅 Filter by date range (optional)
  if (StartDate && EndDate) {
    const start = new Date(StartDate);
    const end = new Date(EndDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: {
          partRequests: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }
    end.setHours(23, 59, 59, 999); // include full day

    query.andWhere('pr.created_at BETWEEN :startDate AND :endDate', {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }

  const [partRequests, total] = await query
    .orderBy('pr.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Part requests found successfully.' : 'No part requests found.',
    data: {
      partRequests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

}
