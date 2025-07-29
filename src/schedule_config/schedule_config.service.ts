import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleConfig } from './entities/schedule_config.entity';
import { Repository } from 'typeorm';
import { CreateScheduleConfigDto } from './dto/create-schedule-config.dto';
import { UpdateScheduleConfigDto } from './dto/update-schedule-config.dto';
import { User } from 'src/users/entities/user.entity';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';

@Injectable()
export class ScheduleConfigService {
 constructor(
    @InjectRepository(ScheduleConfig)
    private readonly scheduleConfigRepo: Repository<ScheduleConfig>,
  ) {}

async create(dto: CreateScheduleConfigDto): Promise<any> {
  const config = this.scheduleConfigRepo.create({
    schedule_type: dto.schedule_type,
    step: dto.step,
    mail_to: dto.mail_to,
    mail_subject: dto.mail_subject,
    mail_body: dto.mail_body,
    creator: dto.created_by ? ({ id: dto.created_by } as any) : null,
    updator: dto.updated_by ? ({ id: dto.updated_by } as any) : null,
  });

  const saved = await this.scheduleConfigRepo.save(config);

  // Reload with user relations
  const populated = await this.scheduleConfigRepo.findOne({
    where: { id: saved.id },
    relations: ['creator', 'updator'],
  });

  return {
    statusCode: 201,
    message: 'Schedule config created successfully',
    data: populated,
  };
}
//  async update(id: number, dto: UpdateScheduleConfigDto): Promise<any> {
//   const config = await this.scheduleConfigRepo.findOne({ where: { id } });

//   if (!config) {
//     throw new NotFoundException({
//       statusCode: 404,
//       message: `ScheduleConfig with id ${id} not found`,
//     });
//   }

// Object.assign(config, {
//   schedule_type: dto.schedule_type,
//   step: dto.step,
//   mail_to: dto.mail_to,
//   mail_subject: dto.mail_subject,
//   mail_body: dto.mail_body,
//   //created_by: dto.created_by ? ({ id: dto.created_by } as any) : null,
//   updated_by: dto.updated_by ? ({ id: dto.updated_by } as any) : null,
// });

//   const updated = await this.scheduleConfigRepo.save(config);

//   return {
//     statusCode: 200,
//     message: 'ScheduleConfig updated successfully',
//     data: updated,
//   };
// }
async update(id: number, dto: UpdateScheduleConfigDto): Promise<any> {
  const config = await this.scheduleConfigRepo.findOne({ where: { id } });

  if (!config) {
    throw new NotFoundException({
      statusCode: 404,
      message: `ScheduleConfig with id ${id} not found`,
    });
  }

  Object.assign(config, {
    schedule_type: dto.schedule_type,
    step: dto.step,
    mail_to: dto.mail_to,
    mail_subject: dto.mail_subject,
    mail_body: dto.mail_body,
    updator: dto.updated_by ? ({ id: dto.updated_by } as any) : null,
  });

  const updated = await this.scheduleConfigRepo.save(config);

  // Reload with relation to return full updator details
  const populated = await this.scheduleConfigRepo.findOne({
    where: { id: updated.id },
    relations: ['creator', 'updator'],
  });

  return {
    statusCode: 200,
    message: 'ScheduleConfig updated successfully',
    data: populated,
  };
}


async findAll(page = 1): Promise<{
  statusCode: number;
  message: string;
  data: {
    scheduleConfigs: ScheduleConfig[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const take = 10;
  const skip = (page - 1) * take;

  const [scheduleConfigs, total] = await this.scheduleConfigRepo.findAndCount({
    relations: ['created_by', 'updated_by'],
    take,
    skip,
    order: { id: 'DESC' },
  });

  return {
    statusCode: 200,
    message: total > 0
      ? 'Schedule configs retrieved successfully'
      : 'No schedule configs found',
    data: {
      scheduleConfigs,
      total,
      page,
      totalPages: Math.ceil(total / take),
    },
  };
}

async remove(id: number): Promise<{
  statusCode: number;
  message: string;
}> {
  const config = await this.scheduleConfigRepo.findOne({ where: { id } });

  if (!config) {
    return {
      statusCode: 404,
      message: `Schedule config with ID ${id} not found`,
    };
  }

  await this.scheduleConfigRepo.delete(id); // for hard delete
  // OR use soft delete if you have soft-delete setup: await this.scheduleConfigRepository.softDelete(id);

  return {
    statusCode: 200,
    message: `Schedule config with ID ${id} deleted successfully`,
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
    partRequests: ScheduleConfig[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const {
    Page = 1,
    PageSize = 10,
    StartDate,
    EndDate,
    Search,
  } = body;

  const page = Page;
  const limit = PageSize;
  const skip = (page - 1) * limit;

  const query = this.scheduleConfigRepo
    .createQueryBuilder('pr')
   .leftJoinAndSelect('pr.creator', 'creator')   // 👈 include full creator info
    .leftJoinAndSelect('pr.updator', 'updator')
    // .leftJoinAndSelect('pr.product', 'product')
    // .leftJoinAndSelect('pr.creator', 'creator')
    // .leftJoinAndSelect('pr.updator', 'updator')
    .where('1 = 1'); // placeholder for dynamic filters

  // 🔍 Search by schedule_type (optional)
  if (Search?.trim()) {
    const keyword = `%${Search.toLowerCase()}%`;
    query.andWhere('LOWER(pr.schedule_type) LIKE :keyword', { keyword });
  }

  // 📅 Filter by created_at date range (optional)
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

    end.setHours(23, 59, 59, 999); // Include full day
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
    message:
      total > 0
        ? 'Schedule Config requests found successfully.'
        : 'No Schedule Config requests found.',
    data: {
      partRequests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}


// async findByFilters(
//   filters: {
//     id?: number;
//     schedule_type?: string;
//     step?: string;
//     mail_to?: string;
//     mail_subject?: string;
//     mail_body?: string;
//   },
//   page = 1,
//   limit = 10,
// ): Promise<{
//   statusCode: number;
//   message: string;
//   data: {
//     requests: ScheduleConfig[];
//     total: number;
//     page: number;
//     totalPages: number;
//   };
// }> {
//   const query = this.scheduleConfigRepo.createQueryBuilder('pr');

//   // ✅ Filter by ID
//   if (filters.id !== undefined) {
//     if (!Number.isInteger(filters.id)) {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "id" filter',
//         data: { requests: [], total: 0, page, totalPages: 0 },
//       };
//     }
//     query.andWhere('pr.id = :id', { id: filters.id });
//   }

//   // ✅ Filter by Step
//   if (filters.step !== undefined) {
//     const val = filters.step.trim();
//     if (!val) {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "step" filter',
//         data: { requests: [], total: 0, page, totalPages: 0 },
//       };
//     }
//     query.andWhere('pr.step ILIKE :step', { step: `%${val}%` });
//   }

//   // ✅ Filter by Schedule Type
//   if (filters.schedule_type !== undefined) {
//     const val = filters.schedule_type.trim();
//     if (!val) {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "schedule_type" filter',
//         data: { requests: [], total: 0, page, totalPages: 0 },
//       };
//     }
//     query.andWhere('pr.schedule_type ILIKE :schedule_type', { schedule_type: `%${val}%` });
//   }

//   // ✅ Filter by Mail To
//   if (filters.mail_to !== undefined) {
//     const val = filters.mail_to.trim();
//     if (!val) {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "mail_to" filter',
//         data: { requests: [], total: 0, page, totalPages: 0 },
//       };
//     }
//     query.andWhere('pr.mail_to ILIKE :mail_to', { mail_to: `%${val}%` });
//   }

//   // ✅ Filter by Mail Subject
//   if (filters.mail_subject !== undefined) {
//     const val = filters.mail_subject.trim();
//     if (!val) {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "mail_subject" filter',
//         data: { requests: [], total: 0, page, totalPages: 0 },
//       };
//     }
//     query.andWhere('pr.mail_subject ILIKE :mail_subject', { mail_subject: `%${val}%` });
//   }

//   // ✅ Filter by Mail Body
//   if (filters.mail_body !== undefined) {
//     const val = filters.mail_body.trim();
//     if (!val) {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "mail_body" filter',
//         data: { requests: [], total: 0, page, totalPages: 0 },
//       };
//     }
//     query.andWhere('pr.mail_body ILIKE :mail_body', { mail_body: `%${val}%` });
//   }

//   // ✅ Pagination + Ordering
//   const [requests, total] = await query
//     .orderBy('pr.id', 'DESC')
//     .skip((page - 1) * limit)
//     .take(limit)
//     .getManyAndCount();

//   return {
//     statusCode: 200,
//     message: total > 0 ? 'Filtered Schedule Configuration retrieved successfully' : 'No records found for the given filters',
//     data: {
//       requests,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// }

async findByFilters(
  filters: {
    id?: number;
    schedule_type?: string;
    step?: string;
    mail_to?: string;
    mail_subject?: string;
    mail_body?: string;
  },
  page: number,
  limit: number,
) {
  const qb = this.scheduleConfigRepo.createQueryBuilder('config')  
   .leftJoinAndSelect('config.creator', 'creator')   // 👈 include full creator info
    .leftJoinAndSelect('config.updator', 'updator');

  if (filters.id) {
    qb.andWhere('config.id = :id', { id: filters.id });
  }
  if (filters.schedule_type) {
    qb.andWhere('config.schedule_type = :schedule_type', { schedule_type: filters.schedule_type });
  }
  if (filters.step) {
    qb.andWhere('config.step = :step', { step: filters.step });
  }
  if (filters.mail_to) {
    qb.andWhere('config.mail_to = :mail_to', { mail_to: filters.mail_to });
  }
  if (filters.mail_subject) {
    qb.andWhere('config.mail_subject = :mail_subject', { mail_subject: filters.mail_subject });
  }
  if (filters.mail_body) {
    qb.andWhere('config.mail_body = :mail_body', { mail_body: filters.mail_body });
  }

  qb.skip((page - 1) * limit).take(limit).orderBy('config.id', 'DESC');

  const [requests, total] = await qb.getManyAndCount();

  return {
    statusCode: 200,
    message: 'Filtered Schedule Configuration retrieved successfully',
    data: {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}


}
