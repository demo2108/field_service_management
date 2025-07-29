import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequest } from './entities/service-request.entity';
import { Repository } from 'typeorm';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { User } from 'src/users/entities/user.entity';
import { ServiceAssignTo } from './entities/service-assign-to.entity';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import { ServiceType } from 'src/service_types/entities/service-type.entity';
import { CreateTaskDto } from './dto/task.dto';
import { ServiceRequestTask } from './entities/service-request-task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ServiceRequestTaskAssignment } from './entities/service-request-task-assignments.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
//import { AppDirectory } from 'src/contract_type/entities/contract_type.entity';
import { v4 as uuidv4 } from 'uuid';
import { AssignEngineerDto } from './dto/assign-engineer.req.dto';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';
import { AppDirectory } from 'src/app_directory/entities/app_directory.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { WorkOrderType } from 'src/work_order_types/entities/work-order-type.entity';

@Injectable()
export class ServiceRequestService {
  constructor(
    @InjectRepository(ServiceRequest)
    private readonly serviceRequestRepo: Repository<ServiceRequest>,
  @InjectRepository(AppDirectory)
    private readonly appDirectoryRepo: Repository<AppDirectory>,
    @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    @InjectRepository(ServiceRequestTask)
    private readonly serviceRequestTaksRepo: Repository<ServiceRequestTask>,

    @InjectRepository(ServiceRequestTaskAssignment)
    private readonly serviceRequestTaksAssignmentRepo: Repository<ServiceRequestTaskAssignment>,
     @InjectRepository(LocationMaster)
        private readonly locationRepository: Repository<LocationMaster>,
         @InjectRepository(ServiceAssignTo)
        private readonly assignEngineerDto: Repository<ServiceAssignTo>,
          @InjectRepository(EventLog)
        private readonly eventLog: Repository<EventLog>,
              @InjectRepository(WorkOrderType)
        private readonly wotyperepo: Repository<WorkOrderType>
  ) { }


// async create(dto: CreateServiceRequestDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: ServiceRequest | null;
// }> {
//   const {
//     engineer_ids,
//     work_order_id,
//     app_dir_id,
//     created_by,   
//     location_id,
//     ...otherFields
//   } = dto;

//   // Validate location_id
//   if (!location_id || location_id <= 0) {
//     return {
//       statusCode: 400,
//       message: 'location_id is required and must be greater than 0',
//       data: null,
//     };
//   }

//   const userRepo = this.serviceRequestRepo.manager.getRepository(User);
//   const workOrderRepo = this.serviceRequestRepo.manager.getRepository(WorkOrder);
//   const appDirectoryRepo = this.appDirectoryRepo.manager.getRepository(AppDirectory);
//   const locationRepo = this.serviceRequestRepo.manager.getRepository(LocationMaster);

//   // Validate engineers
//   const engineers = await userRepo.findByIds(engineer_ids);
//   if (engineers.length !== engineer_ids.length) {
//     return {
//       statusCode: 400,
//       message: 'One or more engineer_ids are invalid',
//       data: null,
//     };
//   }

//   // Validate related entities
//   //const workOrder = await workOrderRepo.findOneBy({ id: work_order_id });
//   const serviceType = await appDirectoryRepo.findOneBy({ id: app_dir_id });
//   const creator = await userRepo.findOneBy({ id: created_by });
//   const location = await locationRepo.findOneBy({ id: location_id });
// let workOrder: WorkOrder | null = null;
// if (work_order_id && work_order_id > 0) {
//   workOrder = await workOrderRepo.findOneBy({ id: work_order_id });

//   if (!workOrder) {
//     return {
//       statusCode: 400,
//       message: `Invalid work_order_id: ${work_order_id}`,
//       data: null,
//     };
//   }
// }

// if (!serviceType) {
//   return {
//     statusCode: 400,
//     message: `Invalid service_name_id: ${app_dir_id}`,
//     data: null,
//   };
// }

// if (!creator) {
//   return {
//     statusCode: 400,
//     message: `Invalid created_by (user ID): ${created_by}`,
//     data: null,
//   };
// }

// if (!location) {
//   return {
//     statusCode: 400,
//     message: `Invalid location_id: ${location_id}`,
//     data: null,
//   };
// }
// const customerRepo = this.serviceRequestRepo.manager.getRepository(Customer);
// const branchRepo = this.serviceRequestRepo.manager.getRepository(Branch);
// const wotyperepo = this.wotyperepo.manager.getRepository(WorkOrderType);

// let customer: Customer | null = null;
// let branch: Branch | null = null;
// let wotype: WorkOrderType | null = null;
// if (dto.customer_id) {
//   customer = await customerRepo.findOneBy({ id: dto.customer_id });
//   if (!customer) {
//     return {
//       statusCode: 400,
//       message: `Invalid customer_id: ${dto.customer_id}`,
//       data: null,
//     };
//   }
// }

// if (dto.branch_id) {
//   branch = await branchRepo.findOneBy({ id: dto.branch_id });
//   if (!branch) {
//     return {
//       statusCode: 400,
//       message: `Invalid branch_id: ${dto.branch_id}`,
//       data: null,
//     };
//   }
// }
// if (dto.work_order_type_id) {
//   wotype = await wotyperepo.findOneBy({ id: dto.work_order_type_id });
//   if (!wotype) {
//     return {
//       statusCode: 400,
//       message: `Invalid work_order_type_id: ${dto.work_order_type_id}`,
//       data: null,
//     };
//   }
// }

//   const assignments = engineers.map((user) => ({ user } as ServiceAssignTo));

//   const service_request_num = `SR-${uuidv4().split('-')[0].toUpperCase()}`;

// // const serviceRequest = this.serviceRequestRepo.create({
// //   ...otherFields,
// //   service_request_num,
// //   work_order: workOrder,
// //   creator,
// //   assigned_engineers: assignments,
// //   location,
// //   location_id,
// //    contract_type: serviceType, 
// // });

// const serviceRequest = this.serviceRequestRepo.create({
//   ...otherFields,
//   service_request_num,
//   creator,
//   assigned_engineers: assignments,
//   location,
//   location_id,
//   contract_type: serviceType,
//   ...(workOrder ? { work_order: workOrder } : {}), 
//     ...(customer ? { customer } : {}),
//   ...(branch ? { branch } : {}),
//    ...(wotype ? { wotype } : {}),// only include if present
// });

//   // const serviceRequest = this.serviceRequestRepo.create({
//   //   ...otherFields,
//   //   work_order: workOrder,
//   //  // service_type: serviceType,
//   //   creator,
//   //   assigned_engineers: assignments,
//   //   location,
//   //   location_id,
//   // });

//   const saved = await this.serviceRequestRepo.save(serviceRequest);

//   const result = await this.serviceRequestRepo.findOne({
//     where: { id: saved.id },
//     relations: [
//       'assigned_engineers',
//       'assigned_engineers.user',
//       'work_order',
//       'work_order.customer',
//       'work_order.branch',
//       'service_type',
//       'creator',
//       'location', 
//       'contract_type',
//         'customer',
//     'branch',
//     'work_order_type',

//     ],
//   });

//   if (!result) {
//     return {
//       statusCode: 404,
//       message: `ServiceRequest with id ${saved.id} not found after creation`,
//       data: null,
//     };
//   }

//   return {
//     statusCode: 201,
//     message: 'ServiceRequest created successfully',
//     data: result,
//   };
// }
async create(dto: CreateServiceRequestDto): Promise<{
  statusCode: number;
  message: string;
  data: ServiceRequest | null;
}> {
  const {
    engineer_ids,
    work_order_id,
    app_dir_id,
    created_by,
    location_id,
    ...otherFields
  } = dto;

  if (!location_id || location_id <= 0) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be greater than 0',
      data: null,
    };
  }

  const userRepo = this.serviceRequestRepo.manager.getRepository(User);
  const workOrderRepo = this.serviceRequestRepo.manager.getRepository(WorkOrder);
  const appDirectoryRepo = this.appDirectoryRepo.manager.getRepository(AppDirectory);
  const locationRepo = this.serviceRequestRepo.manager.getRepository(LocationMaster);
  const customerRepo = this.serviceRequestRepo.manager.getRepository(Customer);
  const branchRepo = this.serviceRequestRepo.manager.getRepository(Branch);
  const wotyperepo = this.wotyperepo.manager.getRepository(WorkOrderType);
  const eventLogRepo = this.serviceRequestRepo.manager.getRepository(EventLog);

  // Validate engineers
  const engineers = await userRepo.findByIds(engineer_ids);
  if (engineers.length !== engineer_ids.length) {
    return {
      statusCode: 400,
      message: 'One or more engineer_ids are invalid',
      data: null,
    };
  }

  const serviceType = await appDirectoryRepo.findOneBy({ id: app_dir_id });
  const creator = await userRepo.findOneBy({ id: created_by });
  const location = await locationRepo.findOneBy({ id: location_id });

  if (!serviceType) {
    return {
      statusCode: 400,
      message: `Invalid service_name_id: ${app_dir_id}`,
      data: null,
    };
  }

  if (!creator) {
    return {
      statusCode: 400,
      message: `Invalid created_by (user ID): ${created_by}`,
      data: null,
    };
  }

  if (!location) {
    return {
      statusCode: 400,
      message: `Invalid location_id: ${location_id}`,
      data: null,
    };
  }

  let customer: Customer | null = null;
  let branch: Branch | null = null;
  let wotype: WorkOrderType | null = null;
  let workOrder: WorkOrder | null = null;

  if (dto.customer_id) {
    customer = await customerRepo.findOneBy({ id: dto.customer_id });
    if (!customer) {
      return {
        statusCode: 400,
        message: `Invalid customer_id: ${dto.customer_id}`,
        data: null,
      };
    }
  }

  if (dto.branch_id) {
    branch = await branchRepo.findOneBy({ id: dto.branch_id });
    if (!branch) {
      return {
        statusCode: 400,
        message: `Invalid branch_id: ${dto.branch_id}`,
        data: null,
      };
    }
  }

  if (dto.work_order_type_id) {
    wotype = await wotyperepo.findOneBy({ id: dto.work_order_type_id });
    if (!wotype) {
      return {
        statusCode: 400,
        message: `Invalid work_order_type_id: ${dto.work_order_type_id}`,
        data: null,
      };
    }
  }

  if (typeof work_order_id === 'number' && work_order_id > 0) {
    workOrder = await workOrderRepo.findOneBy({ id: work_order_id });
    if (!workOrder) {
      return {
        statusCode: 400,
        message: `Invalid work_order_id: ${work_order_id}`,
        data: null,
      };
    }
  }

  const assignments = engineers.map((user) => ({ user } as ServiceAssignTo));
  const service_request_num = `SR-${uuidv4().split('-')[0].toUpperCase()}`;

  const serviceRequest = this.serviceRequestRepo.create({
    ...otherFields,
    service_request_num,
    creator,
    assigned_engineers: assignments,
    location,
    location_id,
    contract_type: serviceType,
    work_order_id: work_order_id, // store 0 if that's what is passed
    ...(workOrder ? { work_order: workOrder } : {}),
    ...(customer ? { customer } : {}),
    ...(branch ? { branch } : {}),
    ...(wotype ? { wotype } : {}),
  });

  const saved = await this.serviceRequestRepo.save(serviceRequest);

  // Log the creation in the EventLog
  await eventLogRepo.save({
    event_name: 'CREATE_SERVICE_REQUEST',
    changed_by: created_by,
    service_request_id: saved.id,
    changed_at: new Date(),
    location_time: new Date(),
    remark: JSON.parse(JSON.stringify(saved)),
  });

  const result = await this.serviceRequestRepo.findOne({
    where: { id: saved.id },
    relations: [
      'assigned_engineers',
      'assigned_engineers.user',
      'work_order',
      'work_order.customer',
      'work_order.branch',
      'service_type',
      'creator',
      'location',
      'contract_type',
      'customer',
      'branch',
      'work_order_type',
    ],
  });

  if (!result) {
    return {
      statusCode: 404,
      message: `ServiceRequest with id ${saved.id} not found after creation`,
      data: null,
    };
  }

  return {
    statusCode: 201,
    message: 'ServiceRequest created successfully',
    data: result,
  };
}


  async findAll(page = 1): Promise<{
  statusCode: number;
  message: string;
  data: {
    items: ServiceRequest[];
    total: number;
    page: number;
  };
}> {
  const take = 10;
  const skip = (page - 1) * take;

  const [items, total] = await this.serviceRequestRepo.findAndCount({
    take,
    skip,
    order: { id: 'DESC' },
    relations: [ // Optional: include if you need related entities
      'assigned_engineers',
      'assigned_engineers.user',
      'work_order',
      'work_order.customer',
      'work_order.branch',
      'service_type',
      'creator',
      'location',
      'contract_type',
        'customer',
    'branch',
    'work_order_type',
    ],
  });

  return {
    statusCode: 200,
    message: 'Service requests fetched successfully',
    data: {
      items,
      total,
      page,
    },
  };
}
async findByFilters(
  filters: {
    id?: number;
    work_order_id?: number;
    service_name_id?: number;
    engineer_id?: number;
    created_by?: number;
    acknowledged?: boolean;
    status?: string;
    priority?: string;
    sequence?: number;
    is_active?: boolean;
     location_id?:number;
       app_dir_id?:number;
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: {
    items: ServiceRequest[];
    total: number;
    page: number;
  };
}> {
  if (!filters.location_id || isNaN(filters.location_id)) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be a valid number',
      data: {
        items: [],
        total: 0,
        page,
       
      },
    };
  }
  const query = this.serviceRequestRepo.createQueryBuilder('sr')
    .leftJoinAndSelect('sr.work_order', 'work_order')
    .leftJoinAndSelect('sr.service_type', 'service_type')
    .leftJoinAndSelect('sr.assigned_engineers', 'assigned_engineers')
    .leftJoinAndSelect('assigned_engineers.user', 'user')
    .leftJoinAndSelect('sr.creator', 'creator')
     .leftJoinAndSelect('sr.location', 'location')
    .leftJoinAndSelect('sr.customer', 'customer')
    .leftJoinAndSelect('sr.branch', 'branch')
    .leftJoinAndSelect('sr.work_order_type', 'work_order_type')
    .leftJoinAndSelect('sr.updator', 'updator')    
     .leftJoinAndSelect('sr.contract_type', 'contract_type');


query.andWhere('sr.location_id = :location_id', {
  location_id: filters.location_id,
});
if (filters.app_dir_id !== undefined) {
  query.andWhere('sr.app_dir_id = :app_dir_id', {
    app_dir_id: filters.app_dir_id,
  });
}

  if (filters.id !== undefined) {
    query.andWhere('sr.id = :id', { id: filters.id });
  }

  if (filters.work_order_id !== undefined) {
    query.andWhere('sr.work_order_id = :work_order_id', { work_order_id: filters.work_order_id });
  }

  if (filters.service_name_id !== undefined) {
    query.andWhere('sr.service_name_id = :service_name_id', { service_name_id: filters.service_name_id });
  }

  if (filters.engineer_id !== undefined) {
    query.andWhere('assigned_engineers.user_id = :engineer_id', { engineer_id: filters.engineer_id });
  }

  if (filters.created_by !== undefined) {
    query.andWhere('sr.created_by = :created_by', { created_by: filters.created_by });
  }

  if (filters.acknowledged !== undefined) {
    query.andWhere('sr.acknowledged = :acknowledged', { acknowledged: filters.acknowledged });
  }

  if (filters.status) {
    query.andWhere('LOWER(sr.status) LIKE LOWER(:status)', { status: `%${filters.status}%` });
  }

  if (filters.priority) {
    query.andWhere('LOWER(sr.priority) LIKE LOWER(:priority)', { priority: `%${filters.priority}%` });
  }

  if (filters.sequence !== undefined) {
    query.andWhere('sr.sequence = :sequence', { sequence: filters.sequence });
  }

  if (filters.is_active !== undefined) {
    query.andWhere('sr.is_active = :is_active', { is_active: filters.is_active });
  }

  const [items, total] = await query
    .orderBy('sr.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  if (total === 0) {
    return {
      statusCode: 204, // No Content
      message: 'No service requests found for the given filters.',
      data: {
        items: [],
        total: 0,
        page,
      },
    };
  }

  return {
    statusCode: 200,
    message: 'Filtered service requests fetched successfully',
    data: {
      items,
      total,
      page,
    },
  };
}
async findOne(id: number): Promise<{
  statusCode: number;
  message: string;
  data: ServiceRequest | null;
}> {
  const request = await this.serviceRequestRepo.findOne({
    where: { id },
    relations: [
      'assigned_engineers',
      'assigned_engineers.user',
      'work_order',
      'service_type',
      'creator',
      'location',
        'customer',
    'branch',
    'work_order_type',
    ],
  });

  if (!request) {
    return {
      statusCode: 404,
      message: `ServiceRequest with ID ${id} not found`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: 'ServiceRequest fetched successfully',
    data: request,
  };
}
async update(
  id: number,
  dto: UpdateServiceRequestDto
): Promise<{
  statusCode: number;
  message: string;
  data: ServiceRequest | null;
}> {
  if (!dto) {
    return {
      statusCode: 400,
      message: 'Request body is missing',
      data: null,
    };
  }

  const existing = await this.serviceRequestRepo.findOne({
    where: { id },
    relations: ['assigned_engineers'],
  });

  if (!existing) {
    return {
      statusCode: 404,
      message: `ServiceRequest with id ${id} not found`,
      data: null,
    };
  }

  const {
    engineer_ids,
    location_id,
    updated_by,
    app_dir_id,
    work_order_type_id,
    branch_id,
    customer_id,
    work_order_id,
    ...otherFields
  } = dto;

  // ✅ Validate and assign location if provided
  if (location_id) {
    const locationRepo = this.serviceRequestRepo.manager.getRepository(LocationMaster);
    const location = await locationRepo.findOneBy({ id: location_id });

    if (!location) {
      return {
        statusCode: 400,
        message: `Invalid location_id: ${location_id}`,
        data: null,
      };
    }

    existing.location = location;
    existing.location_id = location_id;
  }

  // ✅ Validate and assign app_dir_id if provided
  if (app_dir_id) {
    const appDirRepo = this.serviceRequestRepo.manager.getRepository(AppDirectory);
    const appDirectory = await appDirRepo.findOneBy({ id: app_dir_id });

    if (!appDirectory) {
      return {
        statusCode: 400,
        message: `Invalid app_dir_id: ${app_dir_id}`,
        data: null,
      };
    }

    existing.app_dir_id = app_dir_id;
    existing.contract_type = appDirectory;
  }

  // ✅ Handle work_order_id (store 0 or relation)
  if (typeof work_order_id !== 'undefined') {
    if (work_order_id > 0) {
      const workOrder = await this.serviceRequestRepo.manager
        .getRepository(WorkOrder)
        .findOneBy({ id: work_order_id });

      if (!workOrder) {
        return {
          statusCode: 400,
          message: `Invalid work_order_id: ${work_order_id}`,
          data: null,
        };
      }

      existing.work_order = workOrder;
      existing.work_order_id = work_order_id;
    } else {
      // Store 0 and clear relation
      existing.work_order_id = 0;
      existing.work_order == null;
    }
  }

  // ✅ Assign remaining fields
  Object.assign(existing, otherFields);

  // ✅ Update engineers if provided
  if (engineer_ids && engineer_ids.length > 0) {
    const userRepo = this.serviceRequestRepo.manager.getRepository(User);
    const engineers = await userRepo.findByIds(engineer_ids);

    if (engineers.length !== engineer_ids.length) {
      return {
        statusCode: 400,
        message: 'One or more engineer_ids are invalid',
        data: null,
      };
    }

    const newAssignments = engineers.map((user) => ({ user } as ServiceAssignTo));
    existing.assigned_engineers = newAssignments;
  }

  // ✅ Set updated_by and updated_at
  existing.updated_by = updated_by;
  existing.updated_at = new Date();

  // ✅ Assign customer if provided
  if (customer_id) {
    const customer = await this.serviceRequestRepo.manager
      .getRepository(Customer)
      .findOneBy({ id: customer_id });

    if (!customer) {
      return {
        statusCode: 400,
        message: `Invalid customer_id: ${customer_id}`,
        data: null,
      };
    }

    existing.customer = customer;
    existing.customer_id = customer_id;
  }

  // ✅ Assign branch if provided
  if (branch_id) {
    const branch = await this.serviceRequestRepo.manager
      .getRepository(Branch)
      .findOneBy({ id: branch_id });

    if (!branch) {
      return {
        statusCode: 400,
        message: `Invalid branch_id: ${branch_id}`,
        data: null,
      };
    }

    existing.branch = branch;
    existing.branch_id = branch_id;
  }

  // ✅ Assign work_order_type if provided
  if (work_order_type_id) {
    const workOrderType = await this.serviceRequestRepo.manager
      .getRepository(WorkOrderType)
      .findOneBy({ id: work_order_type_id });

    if (!workOrderType) {
      return {
        statusCode: 400,
        message: `Invalid work_order_type_id: ${work_order_type_id}`,
        data: null,
      };
    }

    existing.work_order_type = workOrderType;
    existing.work_order_type_id = work_order_type_id;
  }

  // ✅ Save the updated service request
  await this.serviceRequestRepo.save(existing);

  // ✅ Retrieve with relations after update
  const updated = await this.serviceRequestRepo.findOne({
    where: { id },
    relations: [
      'assigned_engineers',
      'assigned_engineers.user',
      'work_order',
      'work_order.customer',
      'work_order.branch',
      'service_type',
      'creator',
      'location',
      'contract_type',
      'customer',
      'branch',
      'work_order_type',
    ],
  });
    const eventLogRepo = this.serviceRequestRepo.manager.getRepository(EventLog);
  await eventLogRepo.save({
    event_name: 'UPDATE_SERVICE_REQUEST',
    changed_by: updated_by,
    service_request_id: existing.id,
    changed_at: new Date(),
    location_time: new Date(),
    remark: JSON.parse(JSON.stringify(updated)),
  });
 
 if (!updated) {
    return {
      statusCode: 404,
      message: `Updated ServiceRequest with id ${id} not found`,
      data: null,
    };
  }
  return {
    statusCode: 200,
    message: 'ServiceRequest updated successfully',
    data: updated,
  };
}

// async remove(id: number): Promise<{
//   statusCode: number;
//   message: string;
//   data: null;
// }> {
//   const request = await this.serviceRequestRepo.findOne({ where: { id } });

//   if (!request) {
//     return {
//       statusCode: 404,
//       message: `ServiceRequest with ID ${id} not found`,
//       data: null,
//     };
//   }

//   try {
//     await this.serviceRequestRepo.remove(request);

//     return {
//       statusCode: 200,
//       message: 'ServiceRequest deleted successfully',
//       data: null,
//     };
//   } catch (error) {
//     if (error.code === '23503') {
//       // Foreign key violation
//       return {
//         statusCode: 409,
//         message: 'Cannot delete. This ServiceRequest is referenced in another record.',
//         data: null,
//       };
//     }

//     // Other unexpected errors
//     return {
//       statusCode: 500,
//       message: 'An unexpected error occurred while deleting the ServiceRequest.',
//       data: null,
//     };
//   }
// }
async remove(id: number): Promise<{
  statusCode: number;
  message: string;
  data: null;
}> {
  const request = await this.serviceRequestRepo.findOne({ where: { id } });

  if (!request) {
    return {
      statusCode: 404,
      message: `ServiceRequest with ID ${id} not found`,
      data: null,
    };
  }

  try {
 
    await this.serviceRequestTaksRepo.delete({ service_request_id: id });
    await this.assignEngineerDto.delete({ service_request_id: id });
    await this.eventLog.delete({ service_request_id: id });
 
    await this.serviceRequestRepo.remove(request);

    return {
      statusCode: 200,
      message: 'ServiceRequest deleted successfully along with related records',
      data: null,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: 'An unexpected error occurred while deleting the ServiceRequest.',
      data: null,
    };
  }
}

async updateStatus(
  id: number,
): Promise<{ statusCode: number; message: string; data: ServiceRequest | null }> {
  const branch = await this.serviceRequestRepo.findOne({ where: { id } });

  if (!branch) {
    return {
      statusCode: 404,
      message: `Service Request with ID ${id} not found`,
      data: null,
    };
  }

  // Toggle is_active
  branch.is_active = !branch.is_active;

  const updated = await this.serviceRequestRepo.save(branch);
  const eventLogRepo = this.serviceRequestRepo.manager.getRepository(EventLog);
    await eventLogRepo.save({
    event_name: 'SERVICE_REQUEST_STATUS_UPDATE',
   // changed_by: c,
    service_request_id: updated.id,
    changed_at: new Date(),
    location_time: new Date(),
    remark: JSON.parse(JSON.stringify(updated)),
  });
  return {
    statusCode: 200,
    message: `Service Request  status updated to ${updated.is_active ? 'Active' : 'Inactive'}`,
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
    requests: ServiceRequest[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const { Page, PageSize, StartDate, EndDate, Search, Work_order_id, location_id } = body;
  const page = Page || 1;
  const limit = PageSize || 10;
  const skip = (page - 1) * limit;

  if (!location_id || location_id <= 0) {
    return {
      statusCode: 400,
      message: 'Location_id is required and must be a valid number',
      data: {
        requests: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }

  const query = this.serviceRequestRepo
    .createQueryBuilder('sr')
    .leftJoinAndSelect('sr.work_order', 'work_order')
    .leftJoinAndSelect('sr.service_type', 'service_type')
    .leftJoinAndSelect('sr.assigned_engineers', 'assigned_engineers')
    .leftJoinAndSelect('sr.creator', 'creator')
       .leftJoinAndSelect('sr.customer', 'customer')
    .leftJoinAndSelect('sr.branch', 'branch')
    .leftJoinAndSelect('sr.work_order_type', 'work_order_type')

    .leftJoinAndSelect('sr.location', 'location')
    .leftJoinAndSelect('sr.updator', 'updator')
    .leftJoinAndSelect('sr.contract_type', 'contract_type');

  if (Search) {
    const search = `%${Search.toLowerCase()}%`;
    query.andWhere(
      `(LOWER(sr.status) LIKE :search OR LOWER(sr.priority) LIKE :search OR LOWER(work_order.description) LIKE :search)`,
      { search },
    );
  }

  if (location_id) {
    query.andWhere('location.id = :location_id', { location_id });
  }

  if (Work_order_id) {
    query.andWhere('sr.work_order_id = :workOrderId', { workOrderId: Work_order_id });
  }

  if (StartDate && EndDate) {
    const start = new Date(StartDate);
    const end = new Date(EndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: {
          requests: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    query.andWhere('sr.created_at BETWEEN :start AND :end', {
      start: start.toISOString(),
      end: end.toISOString(),
    });
  }

  const [requests, total] = await query
    .orderBy('sr.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Service requests retrieved successfully' : 'No service requests found',
    data: {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}


// async searchWithPaginationtask(body: {
//   Page: number;
//   PageSize: number;
//   StartDate?: string;
//   EndDate?: string;
//   Search?: string;
//   id?: number;
// }): Promise<{
//   statusCode: number;
//   message: string;
//   data: {
//     requests: ServiceRequestTask[];
//     total: number;
//     page: number;
//     totalPages: number;
//   };
// }> {
//   const { Page, PageSize, StartDate, EndDate, Search ,id} = body;
//   const page = Page || 1;
//   const limit = PageSize || 10;
//   const skip = (page - 1) * limit;

//   const query = this.serviceRequestTaksRepo
//     .createQueryBuilder('task')
//     .leftJoinAndSelect('task.service_request', 'sr')
//     .leftJoinAndSelect('task.assigned_user', 'assigned_user')
//     .leftJoinAndSelect('sr.work_order', 'work_order')
//     .leftJoinAndSelect('sr.location', 'location')
//     .leftJoinAndSelect('sr.contract_type', 'contract_type');

//       if (id) {
//     query.andWhere('task.id = :id', { id });
//   }
//  if (Search) {
//   const search = `%${Search.toLowerCase()}%`;
//   query.andWhere(
//     `(LOWER(task.title) LIKE :search 
//       OR LOWER(task.description) LIKE :search 
//       OR LOWER(task.status) LIKE :search
//       OR LOWER(sr.status) LIKE :search 
//       OR LOWER(sr.priority) LIKE :search 
//       OR LOWER(work_order.description) LIKE :search
//       OR LOWER(location.name) LIKE :search)`,
//     { search },
//   );
// }


//   if (StartDate && EndDate) {
//     const start = new Date(StartDate);
//     const end = new Date(EndDate);

//     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//       return {
//         statusCode: 400,
//         message: 'Invalid StartDate or EndDate format',
//         data: {
//           requests: [],
//           total: 0,
//           page,
//           totalPages: 0,
//         },
//       };
//     }

//     query.andWhere('task.created_at BETWEEN :start AND :end', {
//       start: start.toISOString(),
//       end: end.toISOString(),
//     });
//   }

//   const [requests, total] = await query
//     .orderBy('task.id', 'DESC')
//     .skip(skip)
//     .take(limit)
//     .getManyAndCount();

//   return {
//     statusCode: 200,
//     message: total > 0 ? 'Service request tasks retrieved successfully' : 'No tasks found',
//     data: {
//       requests,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// }
async searchWithPaginationtask(body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
    id?: number;
    service_request_id?: number;
    location_id: number;
  }): Promise<{
    statusCode: number;
    message: string;
    data: {
      requests: ServiceRequestTask[];
      total: number;
      page: number;
      totalPages: number;
    };
  }> {
    const { Page, PageSize, StartDate, EndDate, Search, id, location_id,service_request_id } = body;
 
    // ✅ Enforce required location_id
    if (!location_id || location_id <= 0) {
      return {
        statusCode: 400,
        message: 'location_id is required and must be a valid number',
        data: {
          requests: [],
          total: 0,
          page: Page || 1,
          totalPages: 0,
        },
      };
    }
 
    const page = Page || 1;
    const limit = PageSize || 10;
    const skip = (page - 1) * limit;
 
    const query = this.serviceRequestTaksRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.service_request', 'sr')
      .leftJoinAndSelect('sr.work_order', 'work_order')
      .leftJoinAndSelect('sr.location', 'sr_location')
      .leftJoinAndSelect('sr.contract_type', 'contract_type')
      .leftJoinAndSelect('sr.creator', 'creator')
      .leftJoinAndSelect('sr.updator', 'updator')
      .leftJoinAndSelect('task.location', 'task_location')
      // .leftJoinAndSelect('task.created_by_user', 'created_by_user')
      // .leftJoinAndSelect('task.updated_by_user', 'updated_by_user')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'assigned_user');
 
    // ✅ Mandatory filter by task's own location
    query.andWhere('task_location.id = :location_id', { location_id });
 
    // ✅ Optional filter by task.id
    if (id && Number(id) > 0) {
      query.andWhere('task.id = :id', { id });
    }
 
    if (service_request_id && Number(service_request_id) > 0) {
      query.andWhere('task.service_request_id = :service_request_id', { service_request_id });
    }
 
    // ✅ Search
    if (Search && Search.trim() !== '') {
      const search = `%${Search.toLowerCase()}%`;
      query.andWhere(
        `(LOWER(task.title) LIKE :search
        OR LOWER(task.description) LIKE :search
        OR LOWER(task.status) LIKE :search
        OR LOWER(sr.status) LIKE :search
        OR LOWER(sr.priority) LIKE :search
        OR LOWER(work_order.description) LIKE :search
        OR LOWER(sr_location.name) LIKE :search)`,
        { search },
      );
    }
 
    // ✅ Date range
    if (StartDate && EndDate) {
      const start = new Date(StartDate);
      const end = new Date(EndDate);
 
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
          statusCode: 400,
          message: 'Invalid StartDate or EndDate format',
          data: {
            requests: [],
            total: 0,
            page,
            totalPages: 0,
          },
        };
      }
 
      query.andWhere('task.created_at BETWEEN :start AND :end', {
        start: start.toISOString(),
        end: end.toISOString(),
      });
    }
 
    const [requests, total] = await query
      .orderBy('task.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
 
    return {
      statusCode: 200,
      message: total > 0 ? 'Service request tasks retrieved successfully' : 'No tasks found',
      data: {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
async searchByFields(
  body: {
    status?: string;
    priority?: string;
    sequence?: number;
    location_id?: number;
  }
): Promise<{
  statusCode: number;
  message: string;
  data: ServiceRequest[];
}> {
  const query = this.serviceRequestRepo
    .createQueryBuilder('sr')
    .leftJoinAndSelect('sr.work_order', 'work_order')
    .leftJoinAndSelect('sr.service_type', 'service_type')
    .leftJoinAndSelect('sr.assigned_engineers', 'assigned_engineers')
    .leftJoinAndSelect('assigned_engineers.user', 'user')
    .leftJoinAndSelect('sr.creator', 'creator')
    .leftJoinAndSelect('sr.location', 'location');

  if (body.status) {
    query.andWhere('LOWER(sr.status) = LOWER(:status)', { status: body.status });
  }

  if (body.priority) {
    query.andWhere('LOWER(sr.priority) = LOWER(:priority)', { priority: body.priority });
  }

  if (body.sequence !== undefined) {
    query.andWhere('sr.sequence = :sequence', { sequence: body.sequence });
  }

  if (body.location_id !== undefined) {
    query.andWhere('sr.location_id = :location_id', { location_id: body.location_id });
  }

  const results = await query.orderBy('sr.id', 'DESC').getMany();

  return {
    statusCode: 200,
    message: results.length > 0 ? 'Filtered service requests fetched' : 'No matching records found',
    data: results,
  };
}
// async update(id: number, dto: UpdateServiceRequestDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: ServiceRequest | null;
// }> {
//   if (!dto) {
//     return {
//       statusCode: 400,
//       message: 'Request body is missing',
//       data: null,
//     };
//   }

//   const existing = await this.serviceRequestRepo.findOne({
//     where: { id },
//     relations: ['assigned_engineers'],
//   });

//   if (!existing) {
//     return {
//       statusCode: 404,
//       message: `ServiceRequest with id ${id} not found`,
//       data: null,
//     };
//   }

//   const {
//     engineer_ids,
//     location_id,
//     ...otherFields
//   } = dto;

//   // Validate and assign location if provided
//   if (location_id) {
//     const locationRepo = this.serviceRequestRepo.manager.getRepository(LocationMaster);
//     const location = await locationRepo.findOneBy({ id: location_id });

//     if (!location) {
//       return {
//         statusCode: 400,
//         message: `Invalid location_id: ${location_id}`,
//         data: null,
//       };
//     }

//     existing.location = location;
//     existing.location_id = location_id;
//   }

//   Object.assign(existing, otherFields);

//   // Update engineers if provided
//   if (engineer_ids) {
//     const userRepo = this.serviceRequestRepo.manager.getRepository(User);
//     const engineers = await userRepo.findByIds(engineer_ids);

//     if (engineers.length !== engineer_ids.length) {
//       return {
//         statusCode: 400,
//         message: 'One or more engineer_ids are invalid',
//         data: null,
//       };
//     }

//     const newAssignments = engineers.map((user) => ({ user } as ServiceAssignTo));
//     existing.assigned_engineers = newAssignments;
//   }

//   await this.serviceRequestRepo.save(existing);

//   // Reload full updated data including location
//   const updated = await this.serviceRequestRepo.findOne({
//     where: { id },
//     relations: [
//       'assigned_engineers',
//       'assigned_engineers.user',
//       'work_order',
//       'work_order.customer',
//       'work_order.branch',
//       'service_type',
//       'creator',
//       'location', // ✅ Include location in response
//     ],
//   });

//   if (!updated) {
//     return {
//       statusCode: 404,
//       message: `Updated ServiceRequest with id ${id} not found`,
//       data: null,
//     };
//   }

//   return {
//     statusCode: 200,
//     message: 'ServiceRequest updated successfully',
//     data: updated,
//   };
// }
  // Task
async createTask(dto: CreateTaskDto): Promise<{
  statusCode: number;
  message: string;
  data: any;
}> {
  const { service_request_id, engineer_ids, location_id, ...taskData } = dto;
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
  
  const serviceRequest = await this.serviceRequestRepo.findOne({
    where: { id: service_request_id },
    relations: ['assigned_engineers.user'],
  });

  if (!serviceRequest) {
    return {
      statusCode: 404,
      message: `Service Request with ID ${service_request_id} not found`,
      data: null,
    };
  }

  
  const task = this.serviceRequestTaksRepo.create({
    ...taskData,
    location_id, 
    service_request: serviceRequest,
    creator,
  });

  const savedTask = await this.serviceRequestTaksRepo.save(task);

 
  const assignments = engineer_ids.map((user_id) =>
    this.serviceRequestTaksAssignmentRepo.create({
      task: savedTask,
      user: { id: user_id },
    })
  );

  await this.serviceRequestTaksAssignmentRepo.save(assignments);

 
  const fullTask = await this.serviceRequestTaksRepo.findOne({
    where: { id: savedTask.id },
    relations: ['service_request.assigned_engineers.user', 'location','creator'],
  });

  const eventLogRepo = this.serviceRequestRepo.manager.getRepository(EventLog);
    await eventLogRepo.save({
    event_name: 'CREATE_SERVICE_REQUEST_TASK',
    //changed_by: cre,
    service_request_task_id: savedTask.id,
    changed_at: new Date(),
    location_time: new Date(),
    remark: JSON.parse(JSON.stringify(fullTask)),
  });

  return {
    statusCode: 201,
    message: 'Task created successfully',
    data: fullTask,
  };
}
async updateTask(taskId: number, dto: UpdateTaskDto): Promise<{
  statusCode: number;
  message: string;
  data: any;
}> {
  const task = await this.serviceRequestTaksRepo.findOne({
    where: { id: taskId },
  });
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
  if (!task) {
    return {
      statusCode: 404,
      message: `Task with ID ${taskId} not found`,
      data: null,
    };
  }

  // Assign values
  if (dto.title !== undefined) task.title = dto.title;
  if (dto.description !== undefined) task.description = dto.description;
  if (dto.start_date !== undefined) task.start_date = new Date(dto.start_date);
  if (dto.end_date !== undefined) task.end_date = new Date(dto.end_date);
  if (dto.status !== undefined) task.status = dto.status;
  if (dto.duration !== undefined) task.duration = dto.duration;
  if (dto.updated_by !== undefined) task.updated_by = dto.updated_by;
  if (dto.location_id !== undefined) {
    task.location = { id: dto.location_id } as any;
  }
  if (dto.service_request_id !== undefined) {
    task.service_request = { id: dto.service_request_id } as any;
  }

  const updatedTask = await this.serviceRequestTaksRepo.save(task);

  // Update engineer assignments
  if (dto.engineer_ids?.length) {
    await this.serviceRequestTaksAssignmentRepo.delete({ task: { id: taskId } });

    const newAssignments = dto.engineer_ids.map((user_id) =>
      this.serviceRequestTaksAssignmentRepo.create({
        task: updatedTask,
        user: { id: user_id },
      })
    );

    await this.serviceRequestTaksAssignmentRepo.save(newAssignments);
  }

  // Return full task with relations
  const fullTask = await this.serviceRequestTaksRepo.findOne({
    where: { id: updatedTask.id },
    relations: [
      'service_request',
      'location',
      'assignments',
      'assignments.user',
       'updator',
    ],
  });
 const eventLogRepo = this.serviceRequestRepo.manager.getRepository(EventLog);
    await eventLogRepo.save({
    event_name: 'UPDATE_SERVICE_REQUEST_TASK',
    //changed_by: cre,
    service_request_task_id: updatedTask.id,
    changed_at: new Date(),
    location_time: new Date(),
    remark: JSON.parse(JSON.stringify(fullTask)),
  });
  return {
    statusCode: 200,
    message: 'Task updated successfully',
    data: fullTask,
  };
}


// async updateTask(taskId: number, dto: UpdateTaskDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: any;
// }> {
//   const task = await this.serviceRequestTaksRepo.findOne({
//     where: { id: taskId },
//   });

//   if (!task) {
//     return {
//       statusCode: 404,
//       message: `Task with ID ${taskId} not found`,
//       data: null,
//     };
//   }

  
//   if (dto.title !== undefined) task.title = dto.title;
//   if (dto.description !== undefined) task.description = dto.description;
//   if (dto.start_date !== undefined) task.start_date = new Date(dto.start_date);
//   if (dto.end_date !== undefined) task.end_date = new Date(dto.end_date);
//   if (dto.status !== undefined) task.status = dto.status;
//   if (dto.duration !== undefined) task.duration = dto.duration;
//   if (dto.location_id !== undefined) task.location = { id: dto.location_id } as any;

//   // ✅ Assign updated_by
//   if (dto.updated_by !== undefined) task.updated_by = dto.updated_by;

//   // Save task
//   const updatedTask = await this.serviceRequestTaksRepo.save(task);

//   // 👷‍♂️ Update engineer assignments if provided
//   if (dto.engineer_ids && dto.engineer_ids.length > 0) {
//     await this.serviceRequestTaksAssignmentRepo.delete({ task: { id: taskId } });

//     const newAssignments = dto.engineer_ids.map((user_id) =>
//       this.serviceRequestTaksAssignmentRepo.create({
//         task: updatedTask,
//         user: { id: user_id },
//       })
//     );
//     await this.serviceRequestTaksAssignmentRepo.save(newAssignments);
//   }

//   return {
//     statusCode: 200,
//     message: 'Task updated successfully',
//     data: updatedTask,
//   };
// }
  // async createTask(dto: CreateTaskDto): Promise<any> {

  //   const { service_request_id, engineer_ids, ...taskData } = dto;

  //   const serviceRequest = await this.serviceRequestRepo.findOne({
  //     where: { id: service_request_id },
  //   });

  //   if (!serviceRequest) {
  //     throw new NotFoundException(`Service Request with ID ${service_request_id} not found`);
  //   }

  //   const task = this.serviceRequestTaksRepo.create({
  //     ...taskData,
  //     service_request: serviceRequest,
  //   });

  //   const saveTask = await this.serviceRequestTaksRepo.save(task);

  //   const assignments = engineer_ids.map((user_id) =>
  //     this.serviceRequestTaksAssignmentRepo.create({
  //       task: saveTask,
  //       user: { id: user_id },
  //     })
  //   );

  //   await this.serviceRequestTaksAssignmentRepo.save(assignments);

  //   return {
  //     message: 'Task Created Successfully',
  //     task: saveTask,
  //   };

  // }
// async updateTask(taskId: number, dto: UpdateTaskDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: any;
// }> {
//   const task = await this.serviceRequestTaksRepo.findOne({
//     where: { id: taskId },
//   });

//   if (!task) {
//     return {
//       statusCode: 404,
//       message: `Task with ID ${taskId} not found`,
//       data: null,
//     };
//   }

//   // 📝 Update task fields if present
//   if (dto.title !== undefined) task.title = dto.title;
//   if (dto.description !== undefined) task.description = dto.description;

//   const updatedTask = await this.serviceRequestTaksRepo.save(task);

//   // 👷‍♂️ Update engineer assignments if provided
//   if (dto.engineer_ids && dto.engineer_ids.length > 0) {
//     // Remove old assignments
//     await this.serviceRequestTaksAssignmentRepo.delete({ task: { id: taskId } });

//     // Create new assignments
//     const newAssignments = dto.engineer_ids.map((user_id) =>
//       this.serviceRequestTaksAssignmentRepo.create({
//         task: updatedTask,
//         user: { id: user_id },
//       })
//     );
//     await this.serviceRequestTaksAssignmentRepo.save(newAssignments);
//   }

//   return {
//     statusCode: 200,
//     message: 'Task updated successfully',
//     data: updatedTask,
//   };
// }

  // async updateTask(taskId: number, dto: UpdateTaskDto): Promise<any> {

  //   //console.log("id",taskId);
    
  //   const task = await this.serviceRequestTaksRepo.findOne({
  //     where: { id: taskId }
  //   });

  //   if (!task) {
  //     throw new NotFoundException(`Task with ID ${taskId} not found`);
  //   }

  //   if (dto.title !== undefined) task.title = dto.title;
  //   if (dto.description !== undefined) task.description = dto.description;

  //   const updatedTask = await this.serviceRequestTaksRepo.save(task);

  //   if (dto.engineer_ids) {

  //     await this.serviceRequestTaksAssignmentRepo.delete({ task: { id: taskId } });

  //     const newAssignments = dto.engineer_ids.map((user_id) =>
  //       this.serviceRequestTaksAssignmentRepo.create({
  //         task: updatedTask,
  //         user: { id: user_id },
  //       })
  //     );
  //     await this.serviceRequestTaksAssignmentRepo.save(newAssignments);
  //   }

  //   return {
  //     message: 'Task Updated Successfully',
  //     task: updatedTask,
  //   };
  // }

async getTasksByServiceRequestId(id: number): Promise<{
  statusCode: number;
  message: string;
  data: ServiceRequestTask[];
}> {
  const tasks = await this.serviceRequestTaksRepo.find({
    where: {
      service_request: { id },
    },
    relations: ['service_request', 'assignments', 'assignments.user'], // Optional: add related entities
  });

  if (!tasks || tasks.length === 0) {
    return {
      statusCode: 404,
      message: `No tasks found for Service Request ID ${id}`,
      data: [],
    };
  }

  return {
    statusCode: 200,
    message: 'Tasks fetched successfully',
    data: tasks,
  };
}


  // async getTasksByServiceRequestId(id: number): Promise<ServiceRequestTask[]> {

  //   const Taskes = await this.serviceRequestTaksRepo.find({
  //     where: {
  //       service_request: { id: id },
  //     },
  //   });

  //   if (!Taskes) {
  //     throw new NotFoundException(`Service Request task with ID ${id} not found`);
  //   }
  //   return Taskes;
  // }


  async getEngineerByServiceRequestId(
  service_request_id: number,
): Promise<{
  statusCode: number;
  message: string;
  data: ServiceRequestTask[];
}> {
  const tasks = await this.serviceRequestTaksRepo
    .createQueryBuilder('task')
    .leftJoinAndSelect('task.assignments', 'assignments')
    .leftJoinAndSelect('assignments.user', 'assignmentUser')
    .where('task.service_request_id = :service_request_id', { service_request_id })
    .getMany();

  if (!tasks || tasks.length === 0) {
    return {
      statusCode: 404,
      message: `No engineers found for Service Request ID ${service_request_id}`,
      data: [],
    };
  }

  return {
    statusCode: 200,
    message: 'Engineers assigned to tasks fetched successfully',
    data: tasks,
  };
}


async removetask(id: number): Promise<{
  statusCode: number;
  message: string;
  data: null;
}> {
  const request = await this.serviceRequestTaksRepo.findOne({ where: { id } });

  if (!request) {
    return {
      statusCode: 404,
      message: `ServiceRequest with ID ${id} not found`,
      data: null,
    };
  }

  await this.serviceRequestTaksRepo.remove(request);

  return {
    statusCode: 200,
    message: 'Service Request Taks deleted successfully',
    data: null,
  };
}
  // async getEngineerByServiceRequestId(service_request_id: number): Promise<ServiceRequestTask[]> {
  //     return this.serviceRequestTaksRepo
  //       .createQueryBuilder('task')
  //       .leftJoinAndSelect('task.assignments', 'assignments')
  //       .leftJoinAndSelect('assignments.user', 'assignmentUser')
  //       .where('task.service_request_id = :service_request_id', { service_request_id })
  //       .getMany();
  //   }
                                     
}
    