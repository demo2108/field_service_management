import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceType } from './entities/service-type.entity';
import { Repository } from 'typeorm';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ServiceTypesService {
    constructor(
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: Repository<ServiceType>,
            @InjectRepository(User)
          private readonly userRepository: Repository<User>,
  ) {}

//   async create(dto: CreateServiceTypeDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: ServiceType | null;
// }> {
//   const exists = await this.serviceTypeRepository.findOne({
//     where: { name: dto.name },
//   });
//    if (!dto.created_by || typeof dto.created_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`created_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }

//     const creator = await this.userRepository.findOne({
//     where: { id: dto.created_by },
//   });

//   if (!creator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${dto.created_by} (creator) not found.`,
//       data: null,
//     };
//   }

//   if (exists) {
//     return {
//       statusCode: 400,
//       message: `Service type "${dto.name}" already exists.`,
//       data: null,
//     };
//   }

//   const newServiceType = this.serviceTypeRepository.create(dto);
//   const saved = await this.serviceTypeRepository.save(newServiceType);

//   return {
//     statusCode: 201,
//     message: 'Service type created successfully.',
//     data: saved,
//   };
// }
async create(dto: CreateServiceTypeDto): Promise<{
  statusCode: number;
  message: string;
  data: ServiceType | null;
}> {
  const exists = await this.serviceTypeRepository.findOne({
    where: { name: dto.name },
  });

  if (exists) {
    return {
      statusCode: 400,
      message: `Service type "${dto.name}" already exists.`,
      data: null,
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
      message: `User with ID ${dto.created_by} not found.`,
      data: null,
    };
  }

  // Only pass scalar values to create()
  const newServiceType = this.serviceTypeRepository.create({
    ...dto,
    created_by: creator.id,
  });

  const saved = await this.serviceTypeRepository.save(newServiceType);

  // ✅ This reload ensures 'creator' relation is populated
  const final = await this.serviceTypeRepository.findOne({
    where: { id: saved.id },
    relations: ['creator'], // <- KEY POINT
  });

  return {
    statusCode: 201,
    message: 'Service type created successfully.',
    data: final,
  };
}





  // async findAll(): Promise<ServiceType[]> {
  //   return this.serviceTypeRepository.find({
  //     order: { created_at: 'DESC' },
  //   });
  // }

    async findAll(page = 1): Promise<{ data: ServiceType[]; total: number; page: number }> {
    const take = 10;
    const skip = (page - 1) * take;
  
    const [data, total] = await this.serviceTypeRepository.findAndCount({
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
    name?: string;
    description?: string;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
  },
  page = 1,
  limit = 10,
): Promise<{ data: ServiceType[]; total: number; page: number }> {
  const query = this.serviceTypeRepository.createQueryBuilder('st')
   .leftJoinAndSelect('st.creator', 'creator')
    .leftJoinAndSelect('st.updator', 'updator');

  if (filters.id != null) {
    query.andWhere('st.id = :id', { id: filters.id });
  }

  if (filters.name != null) {
    query.andWhere('LOWER(st.name) LIKE LOWER(:name)', { name: `%${filters.name}%` });
  }

  if (filters.description != null) {
    query.andWhere('LOWER(st.description) LIKE LOWER(:description)', {
      description: `%${filters.description}%`,
    });
  }

  if (filters.createdBy != null) {
    query.andWhere('st.created_by = :createdBy', { createdBy: filters.createdBy });
  }

  if (filters.updatedBy != null) {
    query.andWhere('st.updated_by = :updatedBy', { updatedBy: filters.updatedBy });
  }

  if (filters.createdAt != null) {
    query.andWhere('DATE(st.created_at) = :createdAt', { createdAt: filters.createdAt });
  }

  if (filters.updatedAt != null) {
    query.andWhere('DATE(st.updated_at) = :updatedAt', { updatedAt: filters.updatedAt });
  }

  if (filters.isActive != null) {
    query.andWhere('st.is_active = :isActive', { isActive: filters.isActive });
  }

  const [data, total] = await query
    .orderBy('st.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    data,
    total,
    page,
  };
}

  async findOne(id: number): Promise<ServiceType | null> {
    return this.serviceTypeRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateServiceTypeDto): Promise<ServiceType> {
    const serviceType = await this.findOne(id);
    if (!serviceType) {
      throw new NotFoundException(`ServiceType with ID ${id} not found`);
    }

    Object.assign(serviceType, dto);
    return this.serviceTypeRepository.save(serviceType);
  }

  async remove(id: number): Promise<{message : string}> {
    const serviceType = await this.findOne(id);
    if (!serviceType) {
      throw new NotFoundException(`ServiceType with ID ${id} not found`);
    }

    await this.serviceTypeRepository.remove(serviceType);
    return { message :"service type deleted successfully"};
  }
}
