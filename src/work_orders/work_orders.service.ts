import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkOrder } from './entities/work-order.entity';
import { Repository } from 'typeorm';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { AssignEngineerDto } from './dto/assign-engineer.dto';
import { WorkOrderAssignTo } from './entities/workorder_assignto.entity';
import { WorkOrderTask } from './entities/work_order_tasks.entity';
import { TaskAssignment } from './entities/task_assignments.entity';
import { CreateTaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ServiceContract } from 'src/service_contracts/entities/service-contract.entity';
import { ProductService } from 'src/product/product.service';
import { CustomerProductsService } from 'src/customer_products/customer_products.service';
import { CreateCustomerProductDto } from 'src/customer_products/dto/create-customer-product.dto';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';
import { PartRequest } from 'src/part_requests/entities/part-request.entity';
import { ServiceRequest } from 'src/service_request/entities/service-request.entity';
import { ServiceAssignTo } from 'src/service_request/entities/service-assign-to.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { WorkOrderType } from 'src/work_order_types/entities/work-order-type.entity';
import { UpdateWorkOrderStatusDto } from './dto/update-workorder-status.dto';


@Injectable()
export class WorkOrdersService {
  constructor(
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(WorkOrderAssignTo)
    private readonly assignToRepository: Repository<WorkOrderAssignTo>,
    @InjectRepository(WorkOrderTask)
    private readonly taskRepository: Repository<WorkOrderTask>,
 @InjectRepository(ServiceRequest)
    private readonly ServiceRequest: Repository<ServiceRequest>,
    @InjectRepository(TaskAssignment)
    private readonly taskAssignmentRepository: Repository<TaskAssignment>,

    @InjectRepository(ServiceContract)
    private readonly serviceContractRepository: Repository<ServiceContract>,

     @InjectRepository(LocationMaster)
    private readonly locationRepository: Repository<LocationMaster>,
             @InjectRepository(EventLog)
            private readonly eventLog: Repository<EventLog>,
                   @InjectRepository(PartRequest)
            private readonly PartRequest: Repository<PartRequest>,
                  @InjectRepository(ServiceAssignTo)
            private readonly ServiceAssignTo: Repository<ServiceAssignTo>,
     @InjectRepository(Branch)
            private readonly branchRepository: Repository<Branch>,
      @InjectRepository(Customer)
            private readonly customerRepository: Repository<Customer>,
               @InjectRepository(WorkOrderType)
            private readonly workorder_type_repo: Repository<WorkOrderType>,
  private readonly productService: ProductService,
    private readonly customerProductsService: CustomerProductsService,

        @InjectRepository(User)
          private readonly userRepository: Repository<User>,
  ) { }
  // async create(dto: CreateWorkOrderDto): Promise<any> {
  //   const {
  //     status, hold_reason, customer_id, branch_id, created_by,
  //     tasks, ...workOrderData
  //   } = dto;

  //   // Check hold reason if status is 'On Hold'
  //   if (status === 'On Hold' && (!hold_reason || hold_reason.trim() === '')) {
  //     throw new BadRequestException(`Hold reason is required when status is 'On Hold'`);
  //   }

  //   // Generate unique work order ID
  //   const workOrderID = `WO-${uuidv4().split('-')[0].toUpperCase()}`;

  //   // Create and save work order
  //   const workOrder = this.workOrderRepository.create({
  //     ...workOrderData,
  //     status,
  //     hold_reason: status === 'On Hold' ? hold_reason : undefined,
  //     workorder_id: workOrderID,
  //     customer: { id: customer_id },
  //     branch: { id: branch_id },
  //     created_by: { id: created_by },
  //   });

  //   const savedWorkOrder = await this.workOrderRepository.save(workOrder);

  //   // If tasks are provided, handle them
  //   if (Array.isArray(tasks) && tasks.length > 0) {
  //     for (const taskDto of tasks) {
  //       const task = this.taskRepository.create({
  //         title: taskDto.title,
  //         description: taskDto.description,
  //         work_order: savedWorkOrder,
  //       });

  //       const savedTask = await this.taskRepository.save(task);

  //       const assignments = taskDto.engineer_ids?.map((user_id) =>
  //         this.taskAssignmentRepository.create({
  //           task: savedTask,
  //           user: { id: user_id },
  //         })
  //       ) || [];

  //       if (assignments.length > 0) {
  //         await this.taskAssignmentRepository.save(assignments);
  //       }
  //     }
  //   }

  //   //Fetch and return full work order with optional tasks and assignments
  //   const fullWorkOrder = await this.workOrderRepository.findOne({
  //     where: { id: savedWorkOrder.id },
  //     relations: [
  //       'customer',
  //       'branch',
  //       'created_by',
  //       'tasks',
  //       'tasks.assignments',
  //       'tasks.assignments.user',
  //     ],
  //   });

  //   return fullWorkOrder;

  // }
//  async create(dto: CreateWorkOrderDto): Promise<any> {
//     const {
//       status, hold_reason, customer_id, branch_id, created_by,
//       tasks, ...workOrderData
//     } = dto;

//     // Check hold reason if status is 'On Hold'
//     if (status === 'On Hold' && (!hold_reason || hold_reason.trim() === '')) {
//       throw new BadRequestException(`Hold reason is required when status is 'On Hold'`);
//     }

//     // Generate unique work order ID
//     const workOrderID = `WO-${uuidv4().split('-')[0].toUpperCase()}`;

//     // Create and save work order
//     const workOrder = this.workOrderRepository.create({
//       ...workOrderData,
//       status,
//       hold_reason: status === 'On Hold' ? hold_reason : undefined,
//       workorder_id: workOrderID,
//       customer: { id: customer_id },
//       branch: { id: branch_id },
//       created_by: { id: created_by },
//     });

//     const savedWorkOrder = await this.workOrderRepository.save(workOrder);

//     // If tasks are provided, handle them
//     if (Array.isArray(tasks) && tasks.length > 0) {
//       for (const taskDto of tasks) {
//         const task = this.taskRepository.create({
//           title: taskDto.title,
//           description: taskDto.description,
//           work_order: savedWorkOrder,
//         });

//         const savedTask = await this.taskRepository.save(task);

//         const assignments = taskDto.engineer_ids?.map((user_id) =>
//           this.taskAssignmentRepository.create({
//             task: savedTask,
//             user: { id: user_id },
//           })
//         ) || [];

//         if (assignments.length > 0) {
//           await this.taskAssignmentRepository.save(assignments);
//         }
//       }
//     }
// const fullWorkOrder = await this.workOrderRepository.findOne({
//   where: { id: savedWorkOrder.id },
//   relations: [
//     'customer',
//     'branch',
//     'created_by',
//     'tasks',
//     'tasks.assignments',
//     'tasks.assignments.user',
//   ],
// });

// if (!fullWorkOrder) {
//   throw new NotFoundException(`Work order with ID ${savedWorkOrder.id} not found`);
// }


//   // Fetch filtered products using work_order_type_id
//   const filters: any = {};
//   if (typeof dto.work_order_type_id === 'number') {
//     filters.work_order_type = [dto.work_order_type_id];
//   }

//   const filterResult = await this.productService.findByFilters(filters, 1, 10);

//   // Assign filtered products to the customer via CustomerProductsService
//   for (const product of filterResult.data.products) {
// const customerProductDto: CreateCustomerProductDto = {
//   customer_id: fullWorkOrder.customer.id,
//   product_id: product.id,
//   work_order_id: fullWorkOrder.id,
//   no_of_items: fullWorkOrder.no_of_items,
// };

// await this.customerProductsService.create(customerProductDto);
//   }

//   // Return final response
//   return {
//     work_order: fullWorkOrder,
//     filtered_products: filterResult.data.products,
//     pagination: {
//       total: filterResult.data.total,
//       page: filterResult.data.page,
//       totalPages: filterResult.data.totalPages,
//     },
//   };
//   }
//main
// async create(dto: CreateWorkOrderDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: any;
// }> {
//   const {
//     status,
//     hold_reason,
//     customer_id,
//     branch_id,
//     created_by,
//     location_id,
//     tasks,
//     ...workOrderData
//   } = dto;

//   // ✅ Validate hold reason if status is 'On Hold'
//   if (status === 'On Hold' && (!hold_reason || hold_reason.trim() === '')) {
//     return {
//       statusCode: 400,
//       message: `Hold reason is required when status is 'On Hold'`,
//       data: null,
//     };
//   }
//    if (!dto.created_by || typeof dto.created_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`created_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }
//  const creator = await this.userRepository.findOne({
//     where: { id: dto.created_by },
//   });

//   if (!creator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${dto.created_by} (creator) not found.`,
//       data: null,
//     };
//   }
//   // ✅ Generate unique work order ID
//   const workOrderID = `WO-${uuidv4().split('-')[0].toUpperCase()}`;

//   const workOrder = this.workOrderRepository.create({
//     ...workOrderData,
//     status,
//     hold_reason: status === 'On Hold' ? hold_reason : undefined,
//     workorder_id: workOrderID,
//     customer: { id: customer_id },
//     branch: { id: branch_id },
//     created_by: { id: created_by },
//     location: { id: location_id },
//     creator,
//   });

//   const savedWorkOrder = await this.workOrderRepository.save(workOrder);

//   // ✅ Save tasks and assignments if provided
//   if (Array.isArray(tasks) && tasks.length > 0) {
//     for (const taskDto of tasks) {
//       const task = this.taskRepository.create({
//         title: taskDto.title,
//         description: taskDto.description,
//         work_order: savedWorkOrder,
//       });

//       const savedTask = await this.taskRepository.save(task);

//       const assignments =
//         taskDto.engineer_ids?.map((user_id) =>
//           this.taskAssignmentRepository.create({
//             task: savedTask,
//             user: { id: user_id },
//           }),
//         ) || [];

//       if (assignments.length > 0) {
//         await this.taskAssignmentRepository.save(assignments);
//       }
//     }
//   }

//   // ✅ Reload full work order with all relations
//   const fullWorkOrder = await this.workOrderRepository.findOne({
//     where: { id: savedWorkOrder.id },
//     relations: [
//       'customer',
//       'branch',
//       'created_by',
//       'location',
//       'tasks',
//       'tasks.assignments',
//       'tasks.assignments.user',
//       'creator',
//     ],
//   });

//   return {
//     statusCode: 201,
//     message: 'Work Order created successfully',
//     data: fullWorkOrder,
//   };
// }
// async create(dto: CreateWorkOrderDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: any;
// }> {
//   try {
//     const {
//       status,
//       hold_reason,
//       customer_id,
//       branch_id,
//       created_by,
//       location_id,
//       tasks,
//       ...workOrderData
//     } = dto;

//     // ✅ Validate hold reason if status is 'On Hold'
//     if (status === 'On Hold' && (!hold_reason || hold_reason.trim() === '')) {
//       return {
//         statusCode: 400,
//         message: `Hold reason is required when status is 'On Hold'`,
//         data: null,
//       };
//     }

//     if (!created_by || typeof created_by !== 'number') {
//       return {
//         statusCode: 400,
//         message: '`created_by` is required and must be a valid numeric user ID.',
//         data: null,
//       };
//     }

//     // ✅ Validate all foreign key references
//     const [customer, branch, location, user] = await Promise.all([
//       this.customerRepository.findOne({ where: { id: customer_id } }),
//       this.branchRepository.findOne({ where: { id: branch_id } }),
//       this.locationRepository.findOne({ where: { id: location_id } }),
//       this.userRepository.findOne({ where: { id: created_by } }),
//     ]);

//     if (!customer) {
//       return {
//         statusCode: 404,
//         message: `Customer with ID ${customer_id} not found.`,
//         data: null,
//       };
//     }

//     if (!branch) {
//       return {
//         statusCode: 404,
//         message: `Branch with ID ${branch_id} not found.`,
//         data: null,
//       };
//     }

//     if (!location) {
//       return {
//         statusCode: 404,
//         message: `Location with ID ${location_id} not found.`,
//         data: null,
//       };
//     }

//     if (!user) {
//       return {
//         statusCode: 404,
//         message: `User with ID ${created_by} not found.`,
//         data: null,
//       };
//     }

//     // ✅ Generate unique work order ID
//     const workOrderID = `WO-${uuidv4().split('-')[0].toUpperCase()}`;

//     const workOrder = this.workOrderRepository.create({
//       ...workOrderData,
//       status,
//       hold_reason: status === 'On Hold' ? hold_reason : undefined,
//       workorder_id: workOrderID,
//       customer,
//       branch,
//       location,
//       created_by: user,
//       creator: user,
//     });

//     const savedWorkOrder = await this.workOrderRepository.save(workOrder);

//     // ✅ Save tasks and assignments if provided
//     if (Array.isArray(tasks) && tasks.length > 0) {
//       for (const taskDto of tasks) {
//         const task = this.taskRepository.create({
//           title: taskDto.title,
//           description: taskDto.description,
//           work_order: savedWorkOrder,
//         });

//         const savedTask = await this.taskRepository.save(task);

//         const assignments =
//           taskDto.engineer_ids?.map((user_id) =>
//             this.taskAssignmentRepository.create({
//               task: savedTask,
//               user: { id: user_id },
//             }),
//           ) || [];

//         if (assignments.length > 0) {
//           await this.taskAssignmentRepository.save(assignments);
//         }
//       }
//     }

//     // ✅ Reload full work order with all relations
//     const fullWorkOrder = await this.workOrderRepository.findOne({
//       where: { id: savedWorkOrder.id },
//       relations: [
//         'customer',
//         'branch',
//         'created_by',
//         'location',
//         'tasks',
//         'tasks.assignments',
//         'tasks.assignments.user',
//         'creator',
//       ],
//     });

//     return {
//       statusCode: 201,
//       message: 'Work Order created successfully',
//       data: fullWorkOrder,
//     };
//   } catch (error) {
//     // ✅ Catch foreign key or other DB constraint errors
//     if (error.code === '23503') {
//       return {
//         statusCode: 400,
//         message: 'Foreign key constraint failed: ' + error.detail,
//         data: null,
//       };
//     }

//     console.error('Unexpected Error:', error);

//     return {
//       statusCode: 500,
//       message: 'Internal server error',
//       data: null,
//     };
//   }
// }
async create(dto: CreateWorkOrderDto): Promise<{
  statusCode: number;
  message: string;
  data: any;
}> {
  try {
    const {
      status,
      hold_reason,
      customer_id,
      branch_id,
      created_by,
      location_id,
      work_order_type_id,
      tasks,
      ...workOrderData
    } = dto;

    if (status === 'On Hold' && (!hold_reason || hold_reason.trim() === '')) {
      return {
        statusCode: 400,
        message: `Hold reason is required when status is 'On Hold'`,
        data: null,
      };
    }

    if (!created_by || typeof created_by !== 'number') {
      return {
        statusCode: 400,
        message: '`created_by` is required and must be a valid numeric user ID.',
        data: null,
      };
    }

    const [customer, branch, location, user,WorkOrderTypes] = await Promise.all([
      this.customerRepository.findOne({ where: { id: customer_id } }),
      this.branchRepository.findOne({ where: { id: branch_id } }),
      this.locationRepository.findOne({ where: { id: location_id } }),
      this.userRepository.findOne({ where: { id: created_by } }),
            this.workorder_type_repo.findOne({ where: { id: work_order_type_id } }),
    ]);

    if (!customer) {
      return { statusCode: 404, message: `Customer with ID ${customer_id} not found.`, data: null };
    }
    if (!branch) {
      return { statusCode: 404, message: `Branch with ID ${branch_id} not found.`, data: null };
    }
    if (!location) {
      return { statusCode: 404, message: `Location with ID ${location_id} not found.`, data: null };
    }
    if (!user) {
      return { statusCode: 404, message: `User with ID ${created_by} not found.`, data: null };
    }
       if (!WorkOrderTypes) {
      return { statusCode: 404, message: `work_order_type with ID ${work_order_type_id} not found.`, data: null };
    }

    const workOrderID = `WO-${uuidv4().split('-')[0].toUpperCase()}`;

    const workOrder = this.workOrderRepository.create({
      ...workOrderData,
      status,
      hold_reason: status === 'On Hold' ? hold_reason : undefined,
      workorder_id: workOrderID,
      customer,
      branch,
      location,
      created_by: user,
      creator: user,
    });

    const savedWorkOrder = await this.workOrderRepository.save(workOrder);

    if (Array.isArray(tasks) && tasks.length > 0) {
      for (const taskDto of tasks) {
        const task = this.taskRepository.create({
          title: taskDto.title,
          description: taskDto.description,
          work_order: savedWorkOrder,
        });

        const savedTask = await this.taskRepository.save(task);

        const assignments = taskDto.engineer_ids?.map((user_id) =>
          this.taskAssignmentRepository.create({
            task: savedTask,
            user: { id: user_id },
          }),
        ) || [];

        if (assignments.length > 0) {
          await this.taskAssignmentRepository.save(assignments);
        }
      }
    }

    const fullWorkOrder = await this.workOrderRepository.findOne({
      where: { id: savedWorkOrder.id },
      relations: [
        'customer',
        'branch',
        'created_by',
        'location',
        'tasks',
        'tasks.assignments',
        'tasks.assignments.user',
        'creator',
      ],
    });

await this.eventLog.save({
  event_name:'workorder_craete',
   status: 'CREATED',
  module: 'WorkOrder',
  action: 'Create',
  work_order_id:savedWorkOrder.id,
    changed_by: created_by,
    changed_at: new Date(),
     location_time: new Date(),
 
  remark: JSON.parse(JSON.stringify(fullWorkOrder)), // or JSON.stringify(dto) if remark is `string`
});

    return {
      statusCode: 201,
      message: 'Work Order created successfully',
      data: fullWorkOrder,
    };
  } catch (error) {
    // if (error.code === '23503') {
    //   return {
    //     statusCode: 400,
    //     message: 'Foreign key constraint failed: ' + error.detail,
    //     data: null,
    //   };
    // }



    return {
      statusCode: 500,
      message: 'Internal server error',
      data: null,
    };
  }
}


async assignEngineer(dto: AssignEngineerDto): Promise<{
  statusCode: number;
  message: string;
}> {
  const { work_order_id, user_id } = dto;

  const workOrder = await this.workOrderRepository.findOne({ where: { id: work_order_id } });
  if (!workOrder) {
    return {
      statusCode: 404,
      message: `Work order with ID ${work_order_id} not found`,
    };
  }

  const existing = await this.assignToRepository.findOne({
    where: { work_order_id, user_id },
  });

  if (existing) {
    return {
      statusCode: 400,
      message: 'Engineer already assigned to this work order',
    };
  }

  const assignment = this.assignToRepository.create(dto);
  await this.assignToRepository.save(assignment);

  return {
    statusCode: 201,
    message: 'Engineer assigned to work order successfully',
  };
}

 async findAll(page = 1): Promise<{
  statusCode: number;
  message: string;
  data: WorkOrder[];
  total: number;
  page: number;
}> {
  const take = 10;
  const skip = (page - 1) * take;

  const [data, total] = await this.workOrderRepository.findAndCount({
    take,
    skip,
    order: { id: 'DESC' },
  });

  return {
    statusCode: 200,
    message: total > 0 ? 'Work orders retrieved successfully.' : 'No work orders found.',
    data,
    total,
    page,
  };
}

  // async findOne(id: number): Promise<WorkOrder> {
  //   const workOrder = await this.workOrderRepository.findOne({
  //     where: { id },
  //     relations: ['customer', 'branch'],
  //   });

  //   if (!workOrder) {
  //     throw new NotFoundException(`Work order with ID ${id} not found`);
  //   }

  //   return workOrder;
  // }
  async findOne(id: number): Promise<{
  statusCode: number;
  message: string;
  data: WorkOrder | null;
}> {
  const workOrder = await this.workOrderRepository.findOne({
    where: { id },
    relations: ['customer', 'branch'],
  });

  if (!workOrder) {
    return {
      statusCode: 404,
      message: `Work order with ID ${id} not found`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: `Work order with ID ${id} retrieved successfully`,
    data: workOrder,
  };
}
 
  async getTasksByWorkOrderIdQB(workOrderId: number): Promise<{
  statusCode: number;
  message: string;
  data: WorkOrderTask[];
}> {
  try {
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('task.work_order', 'work_order')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'assignmentUser')
      .leftJoinAndSelect('work_order.service_contracts', 'service_contracts')
      .leftJoinAndSelect('service_contracts.service_type', 'service_type')
      .leftJoinAndSelect('work_order.customer_products', 'customer_products')
      .leftJoinAndSelect('customer_products.customer', 'customer')
      .leftJoinAndSelect('customer_products.product', 'product')
      .leftJoinAndSelect('customer_products.installed_by', 'installedBy')
      .leftJoinAndSelect('customer_products.location', 'location')
      .where('task.work_order_id = :workOrderId', { workOrderId })
      .getMany();

    return {
      statusCode: 200,
      message: tasks.length > 0
        ? `Tasks for Work Order ID ${workOrderId} retrieved successfully`
        : `No tasks found for Work Order ID ${workOrderId}`,
      data: tasks,
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      statusCode: 500,
      message: 'Failed to fetch tasks',
      data: [],
    };
  }
}

async findByFilters(
  filters: {
    id?: number;
    customerId?: number;
    branchId?: number;
    workOrderID?: string;
    priority?: string;
    status?: string;
    holdReason?: string;
    forField?: string;
    contactPerson?: string;
    contactPersonNo?: string;
    description?: string;
    targetCompletionDate?: string;
    createdBy?: number;
     location_id?:number;
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: {
    workOrders: WorkOrder[];
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
        workOrders: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  try {
    const query = this.workOrderRepository
      .createQueryBuilder('wo')
      .leftJoinAndSelect('wo.customer', 'customer')
      .leftJoinAndSelect('wo.branch', 'branch')
      .leftJoinAndSelect('wo.work_order_type', 'work_order_type')
      .leftJoinAndSelect('wo.created_by', 'created_by')
      .leftJoinAndSelect('wo.tasks', 'tasks')
      .leftJoinAndSelect('wo.assignments', 'assignments')
      .leftJoinAndSelect('wo.service_contracts', 'service_contracts')
      .leftJoinAndSelect('wo.location', 'location')
        .leftJoinAndSelect('wo.creator', 'creator')
    .leftJoinAndSelect('wo.updator', 'updator')
      .leftJoinAndSelect('wo.customer_products', 'customer_products');
      

    let hasValidFilter = false;
   // Apply location_id (required filter)
    query.andWhere('wo.location_id = :location_id', {
      location_id: filters.location_id,
    });
     hasValidFilter = true;
    // Numeric Filters
    const numericFilters = [
      { key: 'id', column: 'wo.id' },
      { key: 'customerId', column: 'customer.id' },
      { key: 'branchId', column: 'branch.id' },
      { key: 'createdBy', column: 'created_by.id' },
    ];

    for (const { key, column } of numericFilters) {
      const value = filters[key as keyof typeof filters];
      if (value != null && !isNaN(Number(value))) {
        query.andWhere(`${column} = :${key}`, { [key]: value });
        hasValidFilter = true;
      }
    }

    // String Filters
    const stringFilters = [
      { key: 'workOrderID', column: 'wo.workorder_id' },
      { key: 'priority', column: 'wo.priority' },
      { key: 'status', column: 'wo.status' },
      { key: 'holdReason', column: 'wo.hold_reason' },
      { key: 'forField', column: 'wo.for' },
      { key: 'contactPerson', column: 'wo.contact_person' },
      { key: 'contactPersonNo', column: 'wo.contact_person_no' },
      { key: 'description', column: 'wo.description' },
    ];

    for (const { key, column } of stringFilters) {
      const value = (filters[key as keyof typeof filters] as string | undefined)?.trim();
      if (value) {
        query.andWhere(`${column} ILIKE :${key}`, { [key]: `%${value}%` });
        hasValidFilter = true;
      }
    }
 

    
    if (filters.targetCompletionDate?.trim()) {
      query.andWhere(`CAST(wo.target_completion_date AS TEXT) = :targetCompletionDate`, {
        targetCompletionDate: filters.targetCompletionDate.trim(),
      });
      hasValidFilter = true;
    }

    // If no filters provided
    if (!hasValidFilter) {
      return {
        statusCode: 400,
        message: 'At least one valid filter must be provided.',
        data: {
          workOrders: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    const [workOrders, total] = await query
      .orderBy('wo.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      statusCode: 200,
      message: total > 0 ? 'Work orders retrieved successfully.' : 'No work orders found.',
      data: {
        workOrders,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error in findByFilters:', error);
    return {
      statusCode: 500,
      message: 'An error occurred while filtering work orders.',
      data: {
        workOrders: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
}

//   async update(id: number, updateDto: UpdateWorkOrderDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: any;
// }> {
//   if (updateDto.customer_id === 0) {
//     return {
//       statusCode: 400,
//       message: 'Customer ID must be greater than 0',
//       data: null,
//     };
//   }

//   if (updateDto.branch_id === 0) {
//     return {
//       statusCode: 400,
//       message: 'Branch ID must be greater than 0',
//       data: null,
//     };
//   }

//   const workOrder = await this.workOrderRepository.findOne({ where: { id } });

//   if (!workOrder) {
//     return {
//       statusCode: 404,
//       message: `Work Order with ID ${id} not found`,
//       data: null,
//     };
//   }

//   const newStatus = updateDto.status ?? workOrder.status;
//   const newHoldReason = updateDto.hold_reason ?? workOrder.hold_reason;

//   if (newStatus === 'On Hold' && (!newHoldReason || newHoldReason.trim() === '')) {
//     return {
//       statusCode: 400,
//       message: `Hold reason is required when status is 'On Hold'`,
//       data: null,
//     };
//   }

//   if (newStatus !== 'On Hold') {
//     updateDto.hold_reason == null;
//   }

//   // Update work order
//   const updated = Object.assign(workOrder, updateDto);
//   const savedWorkOrder = await this.workOrderRepository.save(updated);

//   // Update engineer assignments if provided
//   if (updateDto.user_ids && Array.isArray(updateDto.user_ids) && updateDto.user_ids.length > 0) {
//     await this.assignToRepository.delete({ work_order_id: savedWorkOrder.id });

//     const assignments = updateDto.user_ids.map((user_id) =>
//       this.assignToRepository.create({
//         work_order_id: savedWorkOrder.id,
//         user_id,
//       }),
//     );

//     await this.assignToRepository.save(assignments);
//   }

//   // Fetch full work order including related entities
//   const finalWorkOrder = await this.workOrderRepository.findOne({
//     where: { id: savedWorkOrder.id },
//     relations: ['customer', 'branch', 'created_by'],
//   });

//   if (!finalWorkOrder) {
//     return {
//       statusCode: 404,
//       message: `Work Order with ID ${savedWorkOrder.id} not found after update`,
//       data: null,
//     };
//   }

//   const assignmentRecords = await this.assignToRepository.find({
//     where: { work_order_id: savedWorkOrder.id },
//   });

//   const { created_by: createdByUser, ...rest } = finalWorkOrder;

//   const result = {
//     ...rest,
//     created_by: createdByUser
//       ? {
//           id: createdByUser.id,
//           name: createdByUser.name,
//           email: createdByUser.email,
//         }
//       : null,
//     workorder_req_assignid: assignmentRecords,
//   };

//   return {
//     statusCode: 200,
//     message: `Work Order with ID ${id} updated successfully`,
//     data: result,
//   };
// }
//main
// async update(id: number, updateDto: UpdateWorkOrderDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: any;
// }> {
//   // ✅ Manually validate location_id
//   if (
//     updateDto.location_id === undefined ||
//     updateDto.location_id === null ||
//     updateDto.location_id <= 0
//   ) {
//     return {
//       statusCode: 400,
//       message: 'location_id is required and must be greater than 0',
//       data: null,
//     };
//   }
//   if (!updateDto.updated_by || typeof updateDto.updated_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`updated_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }

//   if (updateDto.customer_id === 0) {
//     return {
//       statusCode: 400,
//       message: 'Customer ID must be greater than 0',
//       data: null,
//     };
//   }
//   const updator = await this.userRepository.findOne({ where: { id: updateDto.updated_by } });
//   if (!updator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${updateDto.updated_by} not found`,
//       data: null,
//     };
//   }
//   if (updateDto.branch_id === 0) {
//     return {
//       statusCode: 400,
//       message: 'Branch ID must be greater than 0',
//       data: null,
//     };
//   }

//   const workOrder = await this.workOrderRepository.findOne({ where: { id } });
//   if (!workOrder) {
//     return {
//       statusCode: 404,
//       message: `Work Order with ID ${id} not found`,
//       data: null,
//     };
//   }
//  // const work_order_type_id = await this.workorder_type_repo.findOne({ where: { id } });

//   const work_order_type_id = await this.workorder_type_repo.findOne({ where: { id: updateDto.work_order_type_id } });
//   if (!work_order_type_id) {
//     return {
//       statusCode: 404,
//       message: `work_order_type_id with ID ${updateDto.work_order_type_id} not found`,
//       data: null,
//     };
//   }

//   const newStatus = updateDto.status ?? workOrder.status;
//   const newHoldReason = updateDto.hold_reason ?? workOrder.hold_reason;

//   if (newStatus === 'On Hold' && (!newHoldReason || newHoldReason.trim() === '')) {
//     return {
//       statusCode: 400,
//       message: `Hold reason is required when status is 'On Hold'`,
//       data: null,
//     };
//   }

//   if (newStatus !== 'On Hold') {
//     updateDto.hold_reason == null;
//   }

//   // Update work order
//   const updated = Object.assign(workOrder, updateDto);
//   const savedWorkOrder = await this.workOrderRepository.save(updated);

//   // Update engineer assignments if provided
//   if (updateDto.user_ids && Array.isArray(updateDto.user_ids) && updateDto.user_ids.length > 0) {
//     await this.assignToRepository.delete({ work_order_id: savedWorkOrder.id });

//     const assignments = updateDto.user_ids.map((user_id) =>
//       this.assignToRepository.create({
//         work_order_id: savedWorkOrder.id,
//         user_id,
//       }),
//     );

//     await this.assignToRepository.save(assignments);
//   }

//   // Fetch full work order with location
//   const finalWorkOrder = await this.workOrderRepository.findOne({
//     where: { id: savedWorkOrder.id },
//     relations: ['customer', 'branch', 'created_by', 'location','updator'],
//   });

//   if (!finalWorkOrder) {
//     return {
//       statusCode: 404,
//       message: `Work Order with ID ${savedWorkOrder.id} not found after update`,
//       data: null,
//     };
//   }

//   const assignmentRecords = await this.assignToRepository.find({
//     where: { work_order_id: savedWorkOrder.id },
//   });

//   const { created_by: createdByUser, ...rest } = finalWorkOrder;

//   const result = {
//     ...rest,
//     created_by: createdByUser
//       ? {
//           id: createdByUser.id,
//           name: createdByUser.name,
//           email: createdByUser.email,
//         }
//       : null,
//     location: finalWorkOrder.location,
//     workorder_req_assignid: assignmentRecords,
//   };

//   return {
//     statusCode: 200,
//     message: `Work Order with ID ${id} updated successfully`,
//     data: result,
//   };
// }
async update(id: number, updateDto: UpdateWorkOrderDto): Promise<{
  statusCode: number;
  message: string;
  data: any;
   
}> {
  if (
    updateDto.location_id === undefined ||
    updateDto.location_id === null ||
    updateDto.location_id <= 0
  ) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be greater than 0',
      data: null,
    };
  }

  if (!updateDto.updated_by || typeof updateDto.updated_by !== 'number') {
    return {
      statusCode: 400,
      message: '`updated_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }

  if (updateDto.customer_id === 0) {
    return {
      statusCode: 400,
      message: 'Customer ID must be greater than 0',
      data: null,
    };
  }

  const updator = await this.userRepository.findOne({ where: { id: updateDto.updated_by } });
  if (!updator) {
    return {
      statusCode: 404,
      message: `User with ID ${updateDto.updated_by} not found`,
      data: null,
    };
  }

  if (updateDto.branch_id === 0) {
    return {
      statusCode: 400,
      message: 'Branch ID must be greater than 0',
      data: null,
    };
  }

  const workOrder = await this.workOrderRepository.findOne({ where: { id } });
  if (!workOrder) {
    return {
      statusCode: 404,
      message: `Work Order with ID ${id} not found`,
      data: null,
    };
  }

  const work_order_type_id = await this.workorder_type_repo.findOne({ where: { id: updateDto.work_order_type_id } });
  if (!work_order_type_id) {
    return {
      statusCode: 404,
      message: `work_order_type_id with ID ${updateDto.work_order_type_id} not found`,
      data: null,
    };
  }

  const newStatus = updateDto.status ?? workOrder.status;
  const newHoldReason = updateDto.hold_reason ?? workOrder.hold_reason;

  if (newStatus === 'On Hold' && (!newHoldReason || newHoldReason.trim() === '')) {
    return {
      statusCode: 400,
      message: `Hold reason is required when status is 'On Hold'`,
      data: null,
    };
  }

  if (newStatus !== 'On Hold') {
    updateDto.hold_reason == null;
  }

  // ✅ Save updated work order
  const updated = Object.assign(workOrder, updateDto);
  const savedWorkOrder = await this.workOrderRepository.save(updated);

  // ✅ Re-assign engineers if needed
  if (updateDto.user_ids && Array.isArray(updateDto.user_ids) && updateDto.user_ids.length > 0) {
    await this.assignToRepository.delete({ work_order_id: savedWorkOrder.id });

    const assignments = updateDto.user_ids.map((user_id) =>
      this.assignToRepository.create({
        work_order_id: savedWorkOrder.id,
        user_id,
      }),
    );

    await this.assignToRepository.save(assignments);
  }

  // ✅ Create event log with full request body as remark
  await this.eventLog.save({
    changed_by: updateDto.updated_by,
 work_order_id:id,
    event_name: 'workorder_update',
    status: 'UPDATED',      
    module: 'WorkOrder',
    action: 'Create',
    remark: updateDto, 
    changed_at: new Date(),
     location_time: new Date(),


  });

  // ✅ Fetch complete work order with relations
  const finalWorkOrder = await this.workOrderRepository.findOne({
    where: { id: savedWorkOrder.id },
    relations: ['customer', 'branch', 'created_by', 'location', 'updator'],
  });

  if (!finalWorkOrder) {
    return {
      statusCode: 404,
      message: `Work Order with ID ${savedWorkOrder.id} not found after update`,
      data: null,
    };
  }

  const assignmentRecords = await this.assignToRepository.find({
    where: { work_order_id: savedWorkOrder.id },
  });

  const { created_by: createdByUser, ...rest } = finalWorkOrder;

  const result = {
    ...rest,
    created_by: createdByUser
      ? {
          id: createdByUser.id,
          name: createdByUser.name,
          email: createdByUser.email,
        }
      : null,
    location: finalWorkOrder.location,
    workorder_req_assignid: assignmentRecords,
  };

  return {
    statusCode: 200,
    message: `Work Order with ID ${id} updated successfully`,
    data: result,
  };
}
async remove(id: number): Promise<{
  statusCode: number;
  message: string;
}> {
  try {
    const workOrderResult = await this.findOne(id);

    if (!workOrderResult || !workOrderResult.data) {
      return {
        statusCode: 404,
        message: `Work order with ID ${id} not found`,
      };
    }
await this.taskRepository.delete({ work_order_id: id });
await this.assignToRepository.delete({ work_order_id: id });
await this.eventLog.delete({ work_order_id: id });
await this.PartRequest.delete({ work_order_id: id });
await this.serviceContractRepository.delete({ work_order_id: id });

// 👇 Add this line before deleting service requests
await this.ServiceAssignTo.delete({ service_request_id: workOrderResult.data.id });

await this.ServiceRequest.delete({ work_order_id: id });

// Finally
await this.workOrderRepository.delete(id);
    // Delete all related entities manually
    // await this.taskRepository.delete({ work_order_id: id });
    // await this.assignToRepository.delete({ work_order_id: id });
    //  await this.eventLog.delete({ work_order_id: id });
    //       await this.PartRequest.delete({ work_order_id: id });
    //         await this.serviceContractRepository.delete({ work_order_id: id });
    //                     await this.ServiceRequest.delete({ work_order_id: id });
    // await this.eventHistoryRepo.delete({ work_order_id: id });
    // Add more repositories if needed

    // Then delete the work order
    await this.workOrderRepository.remove(workOrderResult.data);

    return {
      statusCode: 200,
      message: `Work order with ID ${id} deleted successfully`,
    };
  } catch (error) {
    console.error('Error deleting work order:', error);

    return {
      statusCode: 500,
      message: `Failed to delete work order with ID ${id}`,
    };
  }
}
//   async remove(id: number): Promise<{
//   statusCode: number;
//   message: string;
// }> {
//   try {
//     const workOrderResult = await this.findOne(id);

//     if (!workOrderResult || !workOrderResult.data) {
//       return {
//         statusCode: 404,
//         message: `Work order with ID ${id} not found`,
//       };
//     }

//     await this.workOrderRepository.remove(workOrderResult.data);

//     return {
//       statusCode: 200,
//       message: `Work order with ID ${id} deleted successfully`,
//     };
//   } catch (error) {
//     console.error('Error deleting work order:', error);

//     return {
//       statusCode: 500,
//       message: `Failed to delete work order with ID ${id}`,
//     };
//   }
// }
async searchWithPagination(body: {
  Page: number;
  PageSize: number;
  StartDate?: string;
  EndDate?: string;
  Search?: string;
     location_id?: number;
}): Promise<{
  statusCode: number;
  message: string;
  data: {
    workOrders: WorkOrder[];
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
        workOrders: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }

  const query = this.workOrderRepository
    .createQueryBuilder('wo')
    .leftJoinAndSelect('wo.customer', 'customer')
    .leftJoinAndSelect('wo.branch', 'branch')
    .leftJoinAndSelect('wo.created_by', 'created_by')
     .leftJoinAndSelect('wo.creator', 'creator')
    .leftJoinAndSelect('wo.updator', 'updator')
    .leftJoinAndSelect('wo.work_order_type', 'work_order_type')
    .leftJoinAndSelect('wo.location', 'location')
    .orderBy('wo.id', 'DESC');

  // 🔍 Search filter
  if (body.Search) {
    const keyword = `%${body.Search.toLowerCase()}%`;
    query.andWhere(
      `LOWER(wo.workorder_id) LIKE :keyword 
      OR LOWER(wo.status) LIKE :keyword 
      OR LOWER(wo.contact_person) LIKE :keyword 
      OR LOWER(wo.priority) LIKE :keyword 
      OR LOWER(wo.for) LIKE :keyword`,
      { keyword }
    );
  }
    if (location_id) {
    query.andWhere('location.id = :location_id', { location_id: location_id });
  }
  // 📅 Date range filter
  if (body.StartDate && body.EndDate) {
    const start = new Date(body.StartDate);
    const end = new Date(body.EndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: {
          workOrders: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    query.andWhere('wo.created_at BETWEEN :startDate AND :endDate', {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }

  const [workOrders, total] = await query.skip(skip).take(limit).getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Search results found' : 'No work orders found',
    data: {
      workOrders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
async updateStatus(
  id: number,
): Promise<{ statusCode: number; message: string; data: WorkOrder | null }> {
  const workOrder = await this.workOrderRepository.findOne({ where: { id } });

  if (!workOrder) {
    return {
      statusCode: 404,
      message: `Work order with ID ${id} not found`,
      data: null,
    };
  }

  // ✅ Toggle status
  workOrder.is_active = !workOrder.is_active;

  const updated = await this.workOrderRepository.save(workOrder);

  return {
    statusCode: 200,
    message: `Work order is now ${updated.is_active ? 'Active' : 'Inactive'}`,
    data: updated,
  };
}

async updatewoStatus(dto: UpdateWorkOrderStatusDto): Promise<{
  statusCode: number;
  message: string;
  data: any;
}> {
  const workOrder = await this.workOrderRepository.findOne({
    where: { workorder_id: dto.workorder_id },
  });

  if (!workOrder) {
    throw new NotFoundException('Work order not found');
  }

  workOrder.status = dto.status; // now dto.status is guaranteed to be string

  if (dto.updated_by) {
    workOrder.updated_by = dto.updated_by;
  }

  const updatedWorkOrder = await this.workOrderRepository.save(workOrder);

  return {
    statusCode: 200,
    message: 'Work order status updated successfully',
    data: updatedWorkOrder,
  };
}




  // async createTask(dto: CreateTaskDto): Promise<any> {
  //   const { work_order_id, engineer_ids, ...taskData } = dto;

  //   const workOrder = await this.workOrderRepository.findOne({
  //     where: { id: work_order_id },
  //   });

  //   if (!workOrder) {
  //     throw new NotFoundException(`Work order with ID ${work_order_id} not found`);
  //   }

  //   const task = this.taskRepository.create({
  //     ...taskData,
  //     work_order: workOrder,
  //   });

  //   const savedTask = await this.taskRepository.save(task);

  //   const assignments = engineer_ids.map((user_id) =>
  //     this.taskAssignmentRepository.create({
  //       task: savedTask, 
  //       user: { id: user_id },
  //     })
  //   );

  //   await this.taskAssignmentRepository.save(assignments);

  //   return {
  //     message: 'Task created successfully',
  //     task: savedTask,
  //   };
  // }

//main
// async createTask(dto: CreateTaskDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: any;
// }> {
//   const { work_order_id, engineer_ids, location_id, ...taskData } = dto;
//   if (!dto.created_by || typeof dto.created_by !== 'number') {
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
//   const workOrder = await this.workOrderRepository.findOne({
//     where: { id: work_order_id },
//   });

//   if (!workOrder) {
//     return {
//       statusCode: 404,
//       message: `Work order with ID ${work_order_id} not found`,
//       data: null,
//     };
//   }

//   // Validate location_id manually if needed
//   if (!location_id) {
//     return {
//       statusCode: 400,
//       message: 'location_id is required',
//       data: null,
//     };
//   }

//   const location = await this.locationRepository.findOne({
//     where: { id: location_id },
//   });

//   if (!location) {
//     return {
//       statusCode: 404,
//       message: `Location with ID ${location_id} not found`,
//       data: null,
//     };
//   }

//   const task = this.taskRepository.create({
//     ...taskData,
//     work_order: workOrder,
//     location,
//     creator, // Save full relation
//   });

//   const savedTask = await this.taskRepository.save(task);

//   const assignments = engineer_ids.map((user_id) =>
//     this.taskAssignmentRepository.create({
//       task: savedTask,
//       user: { id: user_id },
//     }),
//   );

//   await this.taskAssignmentRepository.save(assignments);

//   // ✅ Fetch with full relations including location
//   const fullTask = await this.taskRepository.findOne({
//     where: { id: savedTask.id },
//     relations: ['work_order', 'work_order.customer', 'work_order.branch', 'location','creator'],
//   });

//   return {
//     statusCode: 201,
//     message: 'Task created successfully',
//     data: fullTask,
//   };
// }
async createTask(dto: CreateTaskDto): Promise<{
  statusCode: number;
  message: string;
  data: any;
}> {
  const { work_order_id, engineer_ids, location_id, ...taskData } = dto;

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

  const workOrder = await this.workOrderRepository.findOne({
    where: { id: work_order_id },
  });

  if (!workOrder) {
    return {
      statusCode: 404,
      message: `Work order with ID ${work_order_id} not found`,
      data: null,
    };
  }

  if (!location_id) {
    return {
      statusCode: 400,
      message: 'location_id is required',
      data: null,
    };
  }

  const location = await this.locationRepository.findOne({
    where: { id: location_id },
  });

  if (!location) {
    return {
      statusCode: 404,
      message: `Location with ID ${location_id} not found`,
      data: null,
    };
  }

  const task = this.taskRepository.create({
    ...taskData,
    work_order: workOrder,
    location,
    creator,
  });

  const savedTask = await this.taskRepository.save(task);

  const assignments = engineer_ids.map((user_id) =>
    this.taskAssignmentRepository.create({
      task: savedTask,
      user: { id: user_id },
    }),
  );

  await this.taskAssignmentRepository.save(assignments);

  const fullTask = await this.taskRepository.findOne({
    where: { id: savedTask.id },
    relations: ['work_order', 'work_order.customer', 'work_order.branch', 'location', 'creator'],
  });

  // ✅ Add EventLog Entry
  await this.eventLog.save({
    event_name: 'create work order task',
     status:'CREATED',
    work_order_task_id: savedTask.id,
      changed_at: new Date(),
     location_time: new Date(),
     changed_by:dto.created_by,
    remark: savedTask, // original request body
    // user: { id: dto.created_by },
  });
  return {
    statusCode: 201,
    message: 'Task created successfully',
    data: fullTask,
  };
}
//   async createTask(dto: CreateTaskDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: any;
// }> {
//   const { work_order_id, engineer_ids, ...taskData } = dto;

//   const workOrder = await this.workOrderRepository.findOne({
//     where: { id: work_order_id },
//   });

//   if (!workOrder) {
//     return {
//       statusCode: 404,
//       message: `Work order with ID ${work_order_id} not found`,
//       data: null,
//     };
//   }

//   const task = this.taskRepository.create({
//     ...taskData,
//     work_order: workOrder,
//   });

//   const savedTask = await this.taskRepository.save(task);

//   const assignments = engineer_ids.map((user_id) =>
//     this.taskAssignmentRepository.create({
//       task: savedTask,
//       user: { id: user_id },
//     })
//   );

//   await this.taskAssignmentRepository.save(assignments);

//   return {
//     statusCode: 201,
//     message: 'Task created successfully',
//     data: savedTask,
//   };
// }
  // async updateTask(taskId: number, dto: UpdateTaskDto): Promise<any> {
    
  //   const task = await this.taskRepository.findOne({
  //     where: { id: taskId },
  //     relations: ['assignments'],
  //   });

  //   if (!task) {
  //     throw new NotFoundException(`Task with ID ${taskId} not found`);
  //   }

  //   // Update task properties
  //   if (dto.title !== undefined) task.title = dto.title;
  //   if (dto.description !== undefined) task.description = dto.description;

  //   const updatedTask = await this.taskRepository.save(task);

  //   // If engineer_ids are provided, update assignments
  //   if (dto.engineer_ids) {
  //     // Delete old assignments
  //     await this.taskAssignmentRepository.delete({ task: { id: taskId } });

  //     // Add new assignments
  //     const newAssignments = dto.engineer_ids.map((user_id) =>
  //       this.taskAssignmentRepository.create({
  //         task: updatedTask,
  //         user: { id: user_id },
  //       })
  //     );
  //     await this.taskAssignmentRepository.save(newAssignments);
  //   }

  //   return {
  //     message: 'Task updated successfully',
  //     task: updatedTask,
  //   };
  // }
// async updateTask(taskId: number, dto: UpdateTaskDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: any;
// }> {
//   const task = await this.taskRepository.findOne({
//     where: { id: taskId },
//     relations: ['assignments'],
//   });

//   if (!task) {
//     return {
//       statusCode: 404,
//       message: `Task with ID ${taskId} not found`,
//       data: null,
//     };
//   }

//   // Update task properties
//   if (dto.title !== undefined) task.title = dto.title;
//   if (dto.description !== undefined) task.description = dto.description;

//   await this.taskRepository.save(task);

//   // Update engineer assignments if provided
//   if (dto.engineer_ids) {
//     await this.taskAssignmentRepository.delete({ task: { id: taskId } });

//     const newAssignments = dto.engineer_ids.map((user_id) =>
//       this.taskAssignmentRepository.create({
//         task: { id: taskId },
//         user: { id: user_id },
//       })
//     );

//     await this.taskAssignmentRepository.save(newAssignments);
//   }

  
//   const updatedTask = await this.taskRepository.findOne({
//     where: { id: taskId },
//   relations: [
//   'work_order',
//   'work_order.customer',
//   'work_order.branch',
//   'assignments',
// ]

//   });

//   return {
//     statusCode: 200,
//     message: 'Task updated successfully',
//     data: updatedTask,
//   };
// }
//MAIN
// async updateTask(taskId: number, dto: UpdateTaskDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: any |null;
// }> {
//   const task = await this.taskRepository.findOne({
//     where: { id: taskId },
//     relations: ['assignments', 'updator'],
//   });

//   if (!task) {
//     return {
//       statusCode: 404,
//       message: `Task with ID ${taskId} not found`,
//       data: null,
//     };
//   }
//  if (!dto.updated_by || typeof dto.updated_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`updated_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }
//  const updator = await this.userRepository.findOne({ where: { id: dto.updated_by } });
//   if (!updator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${dto.updated_by} not found`,
//       data: null,
//     };
//   }
//   // ✅ Manually validate location_id if required
//   if (dto.location_id === undefined || dto.location_id === null) {
//     return {
//       statusCode: 400,
//       message: 'location_id is required',
//       data: null,
//     };
//   }

//   // ✅ Fetch and assign new location
//   const location = await this.locationRepository.findOne({ where: { id: dto.location_id } });

//   if (!location) {
//     return {
//       statusCode: 404,
//       message: `Location with ID ${dto.location_id} not found`,
//       data: null,
//     };
//   }

//   // ✅ Update task fields
//   if (dto.title !== undefined) task.title = dto.title;
//   if (dto.description !== undefined) task.description = dto.description;
//   task.location = location;
//     task.updated_by = dto.updated_by;
//   task.updator = updator;

//   await this.taskRepository.save(task);

//   // ✅ Update engineer assignments
//   if (dto.engineer_ids) {
//     await this.taskAssignmentRepository.delete({ task: { id: taskId } });

//     const newAssignments = dto.engineer_ids.map((user_id) =>
//       this.taskAssignmentRepository.create({
//         task: { id: taskId },
//         user: { id: user_id },
//       })
//     );

//     await this.taskAssignmentRepository.save(newAssignments);
//   }

//   // ✅ Fetch full updated task with all relations
//   const updatedTask = await this.taskRepository.findOne({
//     where: { id: taskId },
//     relations: [
//       'work_order',
//       'work_order.customer',
//       'work_order.branch',
//       'assignments',
//       'assignments.user',
//       'location',
//       'updator', // <- include location here
//     ],
//   });

//   return {
//     statusCode: 200,
//     message: 'Task updated successfully',
//     data: updatedTask,
//   };
// }
async updateTask(taskId: number, dto: UpdateTaskDto): Promise<{
  statusCode: number;
  message: string;
  data: any | null;
}> {
  const task = await this.taskRepository.findOne({
    where: { id: taskId },
    relations: ['assignments', 'updator'],
  });

  if (!task) {
    return {
      statusCode: 404,
      message: `Task with ID ${taskId} not found`,
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

  if (dto.location_id === undefined || dto.location_id === null) {
    return {
      statusCode: 400,
      message: 'location_id is required',
      data: null,
    };
  }

  const location = await this.locationRepository.findOne({ where: { id: dto.location_id } });
  if (!location) {
    return {
      statusCode: 404,
      message: `Location with ID ${dto.location_id} not found`,
      data: null,
    };
  }

  if (dto.title !== undefined) task.title = dto.title;
  if (dto.description !== undefined) task.description = dto.description;
  task.location = location;
  task.updated_by = dto.updated_by;
  task.updator = updator;

  await this.taskRepository.save(task);

  if (dto.engineer_ids) {
    await this.taskAssignmentRepository.delete({ task: { id: taskId } });

    const newAssignments = dto.engineer_ids.map((user_id) =>
      this.taskAssignmentRepository.create({
        task: { id: taskId },
        user: { id: user_id },
      })
    );

    await this.taskAssignmentRepository.save(newAssignments);
  }

  const updatedTask = await this.taskRepository.findOne({
    where: { id: taskId },
    relations: [
      'work_order',
      'work_order.customer',
      'work_order.branch',
      'assignments',
      'assignments.user',
      'location',
      'creator',
      'updator',
    ],
  });

  // ✅ Log event with full task response as remark
  await this.eventLog.save({
    event_name: 'TASK_UPDATED',
    status: 'UPDATED',
    work_order_task_id: taskId,
    timestamp: new Date(),
    changed_at: new Date(),
    location_time: new Date(),
    changed_by: dto.updated_by,
  //  remark: updatedTask, // Full task object with nested relations
  });

  return {
    statusCode: 200,
    message: 'Task updated successfully',
    data: updatedTask,
  };
}
async getTasksByWorkOrderId(id: number): Promise<{
  statusCode: number;
  message: string;
  data: WorkOrderTask[] | null;
}> {
  const tasks = await this.taskRepository.find({
    where: {
      work_order: { id: id },
      
    },
     relations: [
      'location',
    ],
  });

  if (!tasks || tasks.length === 0) {
    return {
      statusCode: 404,
      message: `No tasks found for work order ID ${id}`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: 'Tasks retrieved successfully',
    data: tasks,
  };
}
async getEngineerByWorkOrderId(workOrderId: number): Promise<{
  statusCode: number;
  message: string;
  data: WorkOrderTask[] | null;
}> {
  const tasks = await this.taskRepository
    .createQueryBuilder('task')
    .leftJoinAndSelect('task.user', 'user')
    .leftJoinAndSelect('task.assignments', 'assignments')
    .leftJoinAndSelect('assignments.user', 'assignmentUser')
      .leftJoinAndSelect('task.location', 'location') 
    .where('task.work_order_id = :workOrderId', { workOrderId })
    .getMany();

  if (!tasks || tasks.length === 0) {
    return {
      statusCode: 404,
      message: `No tasks or engineers found for Work Order ID ${workOrderId}`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: `Engineers retrieved successfully for Work Order ID ${workOrderId}`,
    data: tasks,
  };
}
async getServiceContactsByWorkOrderId(id: number): Promise<{
  statusCode: number;
  message: string;
  data: ServiceContract[] | null;
}> {
  const contracts = await this.serviceContractRepository.find({
    where: {
      work_order: { id },
    },
     relations: [
      'location', 
    ],
  });

  if (!contracts || contracts.length === 0) {
    return {
      statusCode: 404,
      message: `No service contracts found for Work Order ID ${id}`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: `Service contracts retrieved successfully for Work Order ID ${id}`,
    data: contracts,
  };
}
}




