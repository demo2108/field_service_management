import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequestSummary } from './entities/service-request-summary.entity';
import { Repository } from 'typeorm';
import { CreateServiceRequestSummaryDto } from './dto/create-service-request-summary.dto';
import { UpdateServiceRequestSummaryDto } from './dto/update-service-request-summary.dto';

@Injectable()
export class ServiceRequestSummaryService {
      constructor(
    @InjectRepository(ServiceRequestSummary)
    private readonly summaryRepo: Repository<ServiceRequestSummary>,
  ) {}

  // async create(dto: CreateServiceRequestSummaryDto): Promise<ServiceRequestSummary> {
  //   const summary = this.summaryRepo.create(dto);
  //   return await this.summaryRepo.save(summary);
  // }




// async create(dto: CreateServiceRequestSummaryDto): Promise<ServiceRequestSummary> {
//   const request = this.summaryRepo.create({
//     ...dto,
//     customer_product_id: dto.customer_product_id,
//     part_id: dto.part_id
//   });
//   return this.summaryRepo.save(request);
// }
async create(dto: CreateServiceRequestSummaryDto): Promise<ServiceRequestSummary> {
  const exists = await this.summaryRepo.findOne({
    where: { id: dto.customer_product_id },
  });

  if (!exists) {
    throw new BadRequestException(`Customer product  ${dto.customer_product_id} does not exist.`);
  }

  const summary = this.summaryRepo.create(dto);
  return await this.summaryRepo.save(summary);
}


  // async findAll(): Promise<ServiceRequestSummary[]> {
  //   return await this.summaryRepo.find();
  // }

    async findAll(page = 1): Promise<{ data: ServiceRequestSummary[]; total: number; page: number }> {
    const take = 10;
    const skip = (page - 1) * take;
  
    const [data, total] = await this.summaryRepo.findAndCount({
      take,
      skip,
      order: { id: 'DESC' },
    });
  
    return {
      data,
      total,
      page,
    };
  }
async findByFilters(
  filters: {
    id?: number;
    customer_product_id?: number;
    remark?: string;
    repair?: boolean;
    part_id?: number;
  },
  page = 1,
  limit = 10,
): Promise<{ data: ServiceRequestSummary[]; total: number; page: number }> {
  const query = this.summaryRepo.createQueryBuilder('srs')
    .leftJoinAndSelect('srs.customerProduct', 'customerProduct')
    .leftJoinAndSelect('srs.part', 'part');

  if (filters.id !== undefined) {
    query.andWhere('srs.id = :id', { id: filters.id });
  }

  if (filters.customer_product_id !== undefined) {
    query.andWhere('srs.customer_product_id = :customer_product_id', {
      customer_product_id: filters.customer_product_id,
    });
  }

  if (filters.remark) {
    query.andWhere('LOWER(srs.remark) LIKE LOWER(:remark)', {
      remark: `%${filters.remark}%`,
    });
  }

  if (filters.repair !== undefined) {
    query.andWhere('srs.repair = :repair', { repair: filters.repair });
  }

  if (filters.part_id !== undefined) {
    query.andWhere('srs.part_id = :part_id', { part_id: filters.part_id });
  }

  const [data, total] = await query
    .orderBy('srs.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return { data, total, page };
}

  async findOne(id: number): Promise<ServiceRequestSummary> {
    const summary = await this.summaryRepo.findOne({ where: { id } });
    if (!summary) {
      throw new NotFoundException(`Summary with ID ${id} not found`);
    }
    return summary;
  }

async update(id: number, dto: UpdateServiceRequestSummaryDto): Promise<ServiceRequestSummary> {
  const summary = await this.summaryRepo.findOne({ where: { id } });

  if (!summary) {
    throw new NotFoundException(`Summary with ID ${id} not found`);
  }

  summary.customer_product_id = dto.customer_product_id;
  summary.remark = dto.remark;
  summary.repair = dto.repair;
  summary.part_id = dto.part_id;

  return this.summaryRepo.save(summary);
}

  async remove(id: number): Promise<{ message: string }> {
    const summary = await this.findOne(id);
    await this.summaryRepo.remove(summary);
    return { message: `Summary with ID ${id} removed successfully` };
  }
}
