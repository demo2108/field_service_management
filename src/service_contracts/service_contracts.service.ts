import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceContract } from './entities/service-contract.entity';
import { Repository } from 'typeorm';
import { CreateServiceContractDto } from './dto/create-service-contract.dto';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { AppDirectory } from 'src/app_directory/entities/app_directory.entity';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';

@Injectable()
export class ServiceContractsService {
    constructor(
    @InjectRepository(ServiceContract)
    private readonly contractRepo: Repository<ServiceContract>,
     @InjectRepository(LocationMaster)
    private readonly locationRepository: Repository<LocationMaster>,
      @InjectRepository(User)
          private readonly userRepository: Repository<User>,
          @InjectRepository(AppDirectory)
  private readonly appDirectoryRepository: Repository<AppDirectory>,
   @InjectRepository(EventLog)
      private eventLogRepository: Repository<EventLog>,
          
  ) {}

//main
// async create(dto: CreateServiceContractDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: ServiceContract | null;
// }> {
//   try {
//     // Validate created_by
//     if (!dto.created_by || typeof dto.created_by !== 'number') {
//       return {
//         statusCode: 400,
//         message: '`created_by` is required and must be a valid numeric user ID.',
//         data: null,
//       };
//     }

//     const creator = await this.userRepository.findOne({ where: { id: dto.created_by } });

//     if (!creator) {
//       return {
//         statusCode: 404,
//         message: `User with ID ${dto.created_by} (creator) not found.`,
//         data: null,
//       };
//     }

//     // Validate contract_type_id if provided
//   let contractType: AppDirectory | null = null;
// let location: LocationMaster | null = null;
//     if (dto.contract_type_id) {
//       contractType = await this.appDirectoryRepository.findOne({
//         where: { id: dto.contract_type_id, is_active: true },
//       });

//       if (!contractType) {
//         return {
//           statusCode: 404,
//           message: `Contract type with ID ${dto.contract_type_id} not found or inactive.`,
//           data: null,
//         };
//       }
//     }

//     // Validate location_id if provided
//   //  let location = null;
//     if (dto.location_id) {
//       location = await this.locationRepository.findOne({
//         where: { id: dto.location_id },
//       });

//       if (!location) {
//         return {
//           statusCode: 404,
//           message: `Location with ID ${dto.location_id} not found.`,
//           data: null,
//         };
//       }
//     }

//     // Check if an active contract already exists for the work order
//     const existingActive = await this.contractRepo.findOne({
//       where: {
//         work_order: { id: dto.work_order_id },
//         is_active: true,
//       },
//     });

//     // Generate unique contract number
//     const contract_number = `CON-${uuidv4().split('-')[0].toUpperCase()}`;

//     // Create contract
//     const contract = this.contractRepo.create({
//       contract_number,
//       start_date: dto.start_date,
//       end_date: dto.end_date,
//       is_active: existingActive ? false : true,
//       work_order: { id: dto.work_order_id },
//      // service_type: { id: dto.service_type_id },
//       ...(location && { location }),
//       ...(contractType && { contract_type: contractType }),
//       creator,
//     });

//     // Save contract
//     const savedContract = await this.contractRepo.save(contract);

//     // Reload with full relations
//     const fullData = await this.contractRepo.findOne({
//       where: { id: savedContract.id },
//       relations: [
//         'work_order',
//         'work_order.customer',
//         'work_order.branch',
//         'service_type',
//         'location',
//         'creator',
//         'contract_type',
//       ],
//     });

//     return {
//       statusCode: 201,
//       message: 'Service contract created successfully.',
//       data: fullData,
//     };
//   } catch (error) {
//     console.error('Error in create:', error);
//     return {
//       statusCode: 500,
//       message: 'An error occurred while creating the service contract.',
//       data: null,
//     };
//   }
// }

async create(dto: CreateServiceContractDto): Promise<{
  statusCode: number;
  message: string;
  data: ServiceContract | null;
}> {
  try {
    // Validate created_by
    if (!dto.created_by || typeof dto.created_by !== 'number') {
      return {
        statusCode: 400,
        message: '`created_by` is required and must be a valid numeric user ID.',
        data: null,
      };
    }

    const creator = await this.userRepository.findOne({ where: { id: dto.created_by } });
    if (!creator) {
      return {
        statusCode: 404,
        message: `User with ID ${dto.created_by} (creator) not found.`,
        data: null,
      };
    }

    // Validate contract_type_id
    let contractType: AppDirectory | null = null;
    let location: LocationMaster | null = null;

    if (dto.contract_type_id) {
      contractType = await this.appDirectoryRepository.findOne({
        where: { id: dto.contract_type_id, is_active: true },
      });
      if (!contractType) {
        return {
          statusCode: 404,
          message: `Contract type with ID ${dto.contract_type_id} not found or inactive.`,
          data: null,
        };
      }
    }

    // Validate location_id
    if (dto.location_id) {
      location = await this.locationRepository.findOne({ where: { id: dto.location_id } });
      if (!location) {
        return {
          statusCode: 404,
          message: `Location with ID ${dto.location_id} not found.`,
          data: null,
        };
      }
    }

    // Check if an active contract already exists
    const existingActive = await this.contractRepo.findOne({
      where: {
        work_order: { id: dto.work_order_id },
        is_active: true,
      },
    });

    // Generate unique contract number
    const contract_number = `CON-${uuidv4().split('-')[0].toUpperCase()}`;

    // Create and save contract
    const contract = this.contractRepo.create({
      contract_number,
      start_date: dto.start_date,
      end_date: dto.end_date,
      is_active: existingActive ? false : true,
      work_order: { id: dto.work_order_id },
      ...(location && { location }),
      ...(contractType && { contract_type: contractType }),
      creator,
    });

    const savedContract = await this.contractRepo.save(contract);

    // ✅ Create event log entry
    await this.eventLogRepository.save({
      event_name: 'Service Contract Created',
      work_order_id: dto.work_order_id,
      service_contract_id: savedContract.id, // newly added column
      status: 'CREATED',
      changed_by: dto.created_by,
     // user_id: dto.created_by,
      entry_time: new Date(), // current time
      location_time: new Date(), // optional
      remark: savedContract
    });

    // Fetch full contract details
    const fullData = await this.contractRepo.findOne({
      where: { id: savedContract.id },
      relations: [
        'work_order',
        'work_order.customer',
        'work_order.branch',
        'service_type',
        'location',
        'creator',
        'contract_type',
      ],
    });

    return {
      statusCode: 201,
      message: 'Service contract created successfully.',
      data: fullData,
    };
  } catch (error) {
    console.error('Error in create:', error);
    return {
      statusCode: 500,
      message: 'An error occurred while creating the service contract.',
      data: null,
    };
  }
}

// async create(dto: CreateServiceContractDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: ServiceContract | null;
// }> {
//   try {
//     // Step 1: Check for existing active contract for the same work_order_id
//     const existingActive = await this.contractRepo.findOne({
//       where: {
//         work_order: { id: dto.work_order_id },
//         is_active: true,
//       },
//     });

//     const contract = this.contractRepo.create({
//       contractType: dto.contractType,
//       start_date: dto.start_date,
//       end_date: dto.end_date,
//       is_active: existingActive ? false : true, // Only set active if no active exists
//       work_order: { id: dto.work_order_id },
//       service_type: { id: dto.service_type_id },
//     });

//     const saved = await this.contractRepo.save(contract);

//     // Optional: Reload full object with relations
//     const fullData = await this.contractRepo.findOne({
//       where: { id: saved.id },
//       relations: ['work_order', 'service_type'],
//     });

//     return {
//       statusCode: 201,
//       message: 'Service contract created successfully.',
//       data: fullData,
//     };
//   } catch (error) {
//     console.error('Error in create:', error);
//     return {
//       statusCode: 500,
//       message: 'An error occurred while creating the service contract.',
//       data: null,
//     };
//   }
// }

  //   async findAll(page = 1): Promise<{ data: ServiceContract[]; total: number; page: number }> {
  //   const take = 10;
  //   const skip = (page - 1) * take;
  
  //   const [data, total] = await this.contractRepo.findAndCount({
  //     take,
  //     skip,
  //     order: { id: 'DESC' },
  //   });
  
  //   return {
  //     data,
  //     total,
  //     page,
  //   };
  // }

  async findAll(page = 1): Promise<{
  statusCode: number;
  message: string;
  data: {
    records: ServiceContract[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const take = 10;
  const skip = (page - 1) * take;

  try {
    const [records, total] = await this.contractRepo.findAndCount({
      take,
      skip,
      order: { id: 'DESC' },
      relations: ['work_order', 'service_type','contract_type'], // optional: include relations
    });

    return {
      statusCode: 200,
      message: total > 0 ? 'Service contracts retrieved successfully.' : 'No service contracts found.',
      data: {
        records,
        total,
        page,
        totalPages: Math.ceil(total / take),
      },
    };
  } catch (error) {
    console.error('Error in findAll:', error);
    return {
      statusCode: 500,
      message: 'An error occurred while fetching service contracts.',
      data: {
        records: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
}

// async findByFilters(
//   filters: {
//     id?: number;
//     contractType?: string;
//     start_date?: string;
//     end_date?: string;
//     work_order_id?: number;
//     is_active?: boolean;
//   },
//   page = 1,
//   limit = 10,
// ): Promise<{
//   statusCode: number;
//   message: string;
//   data: {
//     records: ServiceContract[];
//     total: number;
//     page: number;
//     totalPages: number;
//   };
// }> {
//   try {
//     const query = this.contractRepo
//       .createQueryBuilder('sc')
//       .leftJoinAndSelect('sc.work_order', 'work_order')
//       .leftJoinAndSelect('sc.service_type', 'service_type');

//     if (filters.id !== undefined) {
//       query.andWhere('sc.id = :id', { id: filters.id });
//     }

//     if (filters.contractType) {
//       query.andWhere('LOWER(sc.contractType) LIKE LOWER(:contractType)', {
//         contractType: `%${filters.contractType.trim()}%`,
//       });
//     }

//     if (filters.start_date) {
//       query.andWhere('CAST(sc.start_date AS TEXT) = :start_date', {
//         start_date: filters.start_date,
//       });
//     }

//     if (filters.end_date) {
//       query.andWhere('CAST(sc.end_date AS TEXT) = :end_date', {
//         end_date: filters.end_date,
//       });
//     }

//     if (filters.work_order_id !== undefined) {
//       query.andWhere('sc.work_order_id = :work_order_id', {
//         work_order_id: filters.work_order_id,
//       });
//     }

//     if (filters.is_active !== undefined) {
//       query.andWhere('sc.is_active = :is_active', {
//         is_active: filters.is_active,
//       });
//     }

//     const [records, total] = await query
//       .orderBy('sc.id', 'DESC')
//       .skip((page - 1) * limit)
//       .take(limit)
//       .getManyAndCount();

//     return {
//       statusCode: 200,
//       message: total > 0 ? 'Service contracts retrieved successfully.' : 'No records found.',
//       data: {
//         records,
//         total,
//         page,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   } catch (error) {
//     console.error('Error in findByFilters:', error);
//     return {
//       statusCode: 500,
//       message: 'An error occurred while fetching service contracts.',
//       data: {
//         records: [],
//         total: 0,
//         page,
//         totalPages: 0,
//       },
//     };
//   }
// }
async findByFilters(
  filters: {
    id?: number;
    contractType?: string;
    start_date?: string;
    end_date?: string;
    work_order_id?: number;
    is_active?: boolean;
     location_id?: number;
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: {
    records: ServiceContract[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
     if (!filters.location_id || filters.location_id <= 0) {
    return {
      statusCode: 400,
      message: 'Location_id is required and must be a valid number',
      data: {
        records: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  const skip = (page - 1) * limit;

  try {


    
    const query = this.contractRepo
      .createQueryBuilder('sc')
      .leftJoinAndSelect('sc.work_order', 'work_order')
      .leftJoinAndSelect('sc.service_type', 'service_type')
       .leftJoinAndSelect('sc.contract_type', 'contract_type')
       .leftJoinAndSelect('sc.creator', 'creator')
    .leftJoinAndSelect('sc.updator', 'updator')
      .leftJoinAndSelect('sc.location', 'location');

    if (filters.id !== undefined) {
      query.andWhere('sc.id = :id', { id: filters.id });
    }
 if (filters.location_id) {
    query.andWhere('location.id = :location_id', { location_id: filters.location_id });
  }
    if (filters.contractType !== undefined) {
      if (filters.contractType.trim() === '') {
        return {
          statusCode: 400,
          message: 'Invalid value for "contractType" filter',
          data: { records: [], total: 0, page, totalPages: 0 },
        };
      }
      query.andWhere('LOWER(sc.contractType) LIKE LOWER(:contractType)', {
        contractType: `%${filters.contractType.trim()}%`,
      });
    }

    if (filters.start_date !== undefined) {
      if (filters.start_date.trim() === '') {
        return {
          statusCode: 400,
          message: 'Invalid value for "start_date" filter',
          data: { records: [], total: 0, page, totalPages: 0 },
        };
      }
      query.andWhere('CAST(sc.start_date AS TEXT) ILIKE :start_date', {
        start_date: `%${filters.start_date.trim()}%`,
      });
    }

    if (filters.end_date !== undefined) {
      if (filters.end_date.trim() === '') {
        return {
          statusCode: 400,
          message: 'Invalid value for "end_date" filter',
          data: { records: [], total: 0, page, totalPages: 0 },
        };
      }
      query.andWhere('CAST(sc.end_date AS TEXT) ILIKE :end_date', {
        end_date: `%${filters.end_date.trim()}%`,
      });
    }

    if (filters.work_order_id !== undefined) {
      query.andWhere('sc.work_order_id = :work_order_id', {
        work_order_id: filters.work_order_id,
      });
    }

    if (filters.is_active !== undefined) {
      query.andWhere('sc.is_active = :is_active', {
        is_active: filters.is_active,
      });
    }

    const [records, total] = await query
      .orderBy('sc.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      statusCode: 200,
      message: total > 0 ? 'Service contracts retrieved successfully.' : 'No records found.',
      data: {
        records,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error in findByFilters:', error);
    return {
      statusCode: 500,
      message: 'An error occurred while filtering service contracts.',
      data: {
        records: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
}
//   async findOne(id: number): Promise<ServiceContract> {
//     const contract = await this.contractRepo.findOne({ where: { id } });
//     if (!contract) {
//       throw new NotFoundException(`Service contract with ID ${id} not found`);
//     }
//     return contract;
//   }
// async update(id: number, dto: CreateServiceContractDto): Promise<ServiceContract> {
//   const contract = await this.findOne(id);
//   const updated = this.contractRepo.merge(contract, {
//     contractType: dto.contractType,
//     start_date: dto.start_date,
//     end_date: dto.end_date,
//     is_active: dto.is_active,
//     work_order: { id: dto.work_order_id },
//     service_type: { id: dto.service_type_id },
//   });
//   return this.contractRepo.save(updated);
// }
//   async remove(id: number): Promise<{message :string}> {
//     const contract = await this.findOne(id);
//     await this.contractRepo.remove(contract);
//      return { message :"service contracts deleted successfully"};
//   }
async findOne(id: number): Promise<{
  statusCode: number;
  message: string;
  data: ServiceContract | null;
}> {
  const contract = await this.contractRepo.findOne({
    where: { id },
    relations: ['work_order', 'service_type','location'],
  });

  if (!contract) {
    return {
      statusCode: 404,
      message: `Service contract with ID ${id} not found`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: 'Service contract retrieved successfully',
    data: contract,
  };
}
//main
// async update(id: number, dto: CreateServiceContractDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: ServiceContract | null;
// }> {
//   const existing = await this.contractRepo.findOne({ where: { id } });

//   if (!existing) {
//     return {
//       statusCode: 404,
//       message: `Service contract with ID ${id} not found`,
//       data: null,
//     };
//   }

//   if (!dto.updated_by || typeof dto.updated_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`updated_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }

//   const updator = await this.userRepository.findOne({ where: { id: dto.updated_by } });
//   if (!updator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${dto.updated_by} not found`,
//       data: null,
//     };
//   }

//   // Optional: validate contract_type
//   let contractType: AppDirectory | null = null;
//   if (dto.contract_type_id) {
//     contractType = await this.appDirectoryRepository.findOne({
//       where: { id: dto.contract_type_id, is_active: true },
//     });

//     if (!contractType) {
//       return {
//         statusCode: 404,
//         message: `Contract type with ID ${dto.contract_type_id} not found or inactive.`,
//         data: null,
//       };
//     }
//   }

//   // Optional: validate location
//   let location: LocationMaster | null = null;
//   if (dto.location_id) {
//     location = await this.locationRepository.findOne({
//       where: { id: dto.location_id },
//     });

//     if (!location) {
//       return {
//         statusCode: 404,
//         message: `Location with ID ${dto.location_id} not found.`,
//         data: null,
//       };
//     }
//   }

//   // Build update payload
//   const updatePayload: any = {
//     start_date: dto.start_date,
//     end_date: dto.end_date,
//     is_active: dto.is_active ?? true,
//     work_order: { id: dto.work_order_id },
//     service_type: { id: dto.service_type_id },
//     updator,
//   };

//   if (location) updatePayload.location = location;
//   if (contractType) updatePayload.contract_type = contractType;

//   const updated = this.contractRepo.merge(existing, updatePayload);
//   await this.contractRepo.save(updated);

//   // Fetch full object with relations
//   const fullContract = await this.contractRepo.findOne({
//     where: { id },
//     relations: [
//       'work_order',
//       'work_order.customer',
//       'work_order.branch',
//       'service_type',
//       'location',
//       'updator',
//       'contract_type',
//     ],
//   });

//   return {
//     statusCode: 200,
//     message: 'Service contract updated successfully',
//     data: fullContract,
//   };
// }
async update(id: number, dto: CreateServiceContractDto): Promise<{
  statusCode: number;
  message: string;
  data: ServiceContract | null;
}> {
  const existing = await this.contractRepo.findOne({
    where: { id },
    relations: ['work_order', 'service_type', 'location', 'contract_type'],
  });

  if (!existing) {
    return {
      statusCode: 404,
      message: `Service contract with ID ${id} not found`,
      data: null,
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

  let contractType: AppDirectory | null = null;
  if (dto.contract_type_id) {
    contractType = await this.appDirectoryRepository.findOne({
      where: { id: dto.contract_type_id, is_active: true },
    });
    if (!contractType) {
      return {
        statusCode: 404,
        message: `Contract type with ID ${dto.contract_type_id} not found or inactive.`,
        data: null,
      };
    }
  }

  let location: LocationMaster | null = null;
  if (dto.location_id) {
    location = await this.locationRepository.findOne({
      where: { id: dto.location_id },
    });
    if (!location) {
      return {
        statusCode: 404,
        message: `Location with ID ${dto.location_id} not found.`,
        data: null,
      };
    }
  }

  // Merge changes
  const updatePayload: any = {
    start_date: dto.start_date,
    end_date: dto.end_date,
    is_active: dto.is_active ?? true,
    work_order: { id: dto.work_order_id },
    service_type: { id: dto.service_type_id },
    updator,
  };

  if (location) updatePayload.location = location;
  if (contractType) updatePayload.contract_type = contractType;

 const updated = this.contractRepo.merge(existing, updatePayload);
await this.contractRepo.save(updated);

const fullContract = await this.contractRepo.findOne({
  where: { id },
  relations: [
    'work_order',
    'service_type',
    'location',
    'updator',
    'contract_type',
  ],
});

if (fullContract) {
  // Optional: remove sensitive fields
  if (fullContract.updator) {
    delete (fullContract.updator as any).password_hash;
  }

  await this.eventLogRepository.save({
    event_name: 'update service contract',
    work_order_id: dto.work_order_id,
    status: 'UPDATED',
    user_id: dto.updated_by,
    service_contract_id: id,
    changed_by: dto.updated_by,
    changed_at: new Date(),
    remark: fullContract as object, 
     location_time: new Date(),
  });
}




  return {
    statusCode: 200,
    message: 'Service contract updated successfully',
    data: fullContract,
  };
}



// async update(id: number, dto: CreateServiceContractDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: ServiceContract | null;
// }> {
//   const existing = await this.contractRepo.findOne({ where: { id } });

//   if (!existing) {
//     return {
//       statusCode: 404,
//       message: `Service contract with ID ${id} not found`,
//       data: null,
//     };
//   }
//   if (!dto.updated_by || typeof dto.updated_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`updated_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }
//    const updator = await this.userRepository.findOne({ where: { id: dto.updated_by } });
//   if (!updator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${dto.updated_by} not found`,
//       data: null,
//     };
//   }
//   const updated = this.contractRepo.merge(existing, {
   
//     start_date: dto.start_date,
//     end_date: dto.end_date,
//     is_active: dto.is_active ?? true,
//     work_order: { id: dto.work_order_id },
//     service_type: { id: dto.service_type_id },
//     ...(dto.location_id && { location: { id: dto.location_id } }),
//      ...(dto.contract_type_id && { contract_type_ids: { id: dto.contract_type_id } }),
//     updator, // ✅ Include location relation if present
//   });

//   await this.contractRepo.save(updated);

//   // ✅ Re-fetch with all necessary relations
//   const fullContract = await this.contractRepo.findOne({
//     where: { id },
//     relations: [
//       'work_order',
//       'work_order.customer',
//       'work_order.branch',
//       'service_type',
//       'location',
//       'updator',
//       'contract_type_ids' // ✅ include location relation in response
//     ],
//   });

//   return {
//     statusCode: 200,
//     message: 'Service contract updated successfully',
//     data: fullContract,
//   };
// }

async remove(id: number): Promise<{
  statusCode: number;
  message: string;
  data: null;
}> {
  const contract = await this.contractRepo.findOne({ where: { id } });
  if (!contract) {
    return {
      statusCode: 404,
      message: `Service contract with ID ${id} not found`,
      data: null,
    };
  }

  await this.contractRepo.remove(contract);

  return {
    statusCode: 200,
    message: 'Service contract deleted successfully',
    data: null,
  };
}
// async updateStatus(
//   id: number,
// ): Promise<{ statusCode: number; message: string; data: ServiceContract | null }> {
//   const product = await this.contractRepo.findOne({ where: { id } });

//   if (!product) {
//     return {
//       statusCode: 404,
//       message: `Product with ID ${id} not found.`,
//       data: null,
//     };
//   }

//   // Toggle is_active status
//   product.is_active = !product.is_active;

//   const updated = await this.contractRepo.save(product);

//   return {
//     statusCode: 200,
//     message: `Product is now ${updated.is_active ? 'Active' : 'Inactive'}.`,
//     data: updated,
//   };
// }
async updateStatus(
  id: number,
): Promise<{ statusCode: number; message: string; data: ServiceContract | null }> {
  const product = await this.contractRepo.findOne({
    where: { id },
    relations: ['work_order'], // required to get work_order.id
  });

  if (!product) {
    return {
      statusCode: 404,
      message: `Service contract with ID ${id} not found.`,
      data: null,
    };
  }

  // If trying to activate it
  if (!product.is_active) {
    // Check if another active contract exists for the same work_order_id
    const existingActive = await this.contractRepo.findOne({
      where: {
        work_order: { id: product.work_order.id },
        is_active: true,
      },
    });

    // If another active contract exists (and it's not the current one)
    if (existingActive && existingActive.id !== id) {
      return {
        statusCode: 400,
        message: `Another active contract already exists for Work Order ID ${product.work_order.id}.`,
        data: null,
      };
    }
  }

  // Toggle status
  product.is_active = !product.is_active;

  const updated = await this.contractRepo.save(product);

  return {
    statusCode: 200,
    message: `Service contract is now ${updated.is_active ? 'Active' : 'Inactive'}.`,
    data: updated,
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
    products: ServiceContract[];
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
  const query = this.contractRepo.createQueryBuilder('product')
   .leftJoinAndSelect('product.creator', 'creator')
    .leftJoinAndSelect('product.updator', 'updator')
    .leftJoinAndSelect('product.contract_type', 'contract_type').leftJoinAndSelect('product.location', 'location');

    if (location_id) {
    query.andWhere('location.id = :location_id', { location_id: location_id });
  }
  if (body.Search) {
    const keyword = `%${body.Search.toLowerCase()}%`;
    query.andWhere(
      `(LOWER(product.name) LIKE :keyword OR LOWER(product.model_number) LIKE :keyword)`,
      { keyword }
    );
  }
  if (body.Work_order_id) {
    query.andWhere('product.work_order_id = :workOrderId', {
      workOrderId: body.Work_order_id,
    });
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

    // Ensure time covers the full day range
    end.setHours(23, 59, 59, 999);

    query.andWhere('product.created_at BETWEEN :startDate AND :endDate', {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }

 
  const [products, total] = await query
    .orderBy('product.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'service_contracts found successfully.' : 'No service_contracts found.',
    data: {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

}
