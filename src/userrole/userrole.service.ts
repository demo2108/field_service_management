// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Role } from './entities/role.entity';

// @Injectable()
// export class UserroleService {
//      constructor(
//         @InjectRepository(Role)
//         private userroleRepository: Repository<Role>,
//       ) {}
//      async findAll(): Promise<Role[]> {
//         return this.userroleRepository.find();
//       }
// }
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class UserroleService {
  constructor(
    @InjectRepository(Role)
    private userroleRepository: Repository<Role>,
  ) {}

  // async findAll(): Promise<Role[]> {
  //   return this.userroleRepository.find();
  // }

    async findAll(page = 1): Promise<{ data: Role[]; total: number; page: number }> {
    const take = 10;
    const skip = (page - 1) * take;
  
    const [data, total] = await this.userroleRepository.findAndCount({
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
    rolename?: string;
    permissionid?: number;
    createdby?: string;
    createdat?: string; // date string like '2025-06-10'
  },
  page = 1,
  limit = 10,
): Promise<{ data: Role[]; total: number; page: number }> {
  const query = this.userroleRepository.createQueryBuilder('role');

  if (filters.id != null) {
    query.andWhere('role.id = :id', { id: filters.id });
  }

  if (filters.rolename != null) {
    query.andWhere('LOWER(role.rolename) LIKE LOWER(:rolename)', { rolename: `%${filters.rolename}%` });
  }

  if (filters.permissionid != null) {
    query.andWhere('role.permissionid = :permissionid', { permissionid: filters.permissionid });
  }

  if (filters.createdby != null) {
    query.andWhere('LOWER(role.createdby) LIKE LOWER(:createdby)', { createdby: `%${filters.createdby}%` });
  }

  if (filters.createdat != null) {
    query.andWhere('DATE(role.createdat) = :createdat', { createdat: filters.createdat });
  }

  const [data, total] = await query
    .orderBy('role.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    data,
    total,
    page,
  };
}

  
}
