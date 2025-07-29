import { forwardRef, Module } from '@nestjs/common';
import { WorkOrdersController } from './work_orders.controller';
import { WorkOrdersService } from './work_orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrder } from './entities/work-order.entity';
import { AuthModule } from 'src/auth/auth.module';
import { WorkOrderAssignTo } from './entities/workorder_assignto.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { User } from 'src/users/entities/user.entity';
import { TaskAssignment } from './entities/task_assignments.entity';
import { WorkOrderTask } from './entities/work_order_tasks.entity';
import { ServiceContract } from 'src/service_contracts/entities/service-contract.entity'
import { ProductModule } from 'src/product/product.module';
import { CustomerProductsModule } from 'src/customer_products/customer_products.module';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';
import { PartRequest } from 'src/part_requests/entities/part-request.entity';
import { ServiceRequest } from 'src/service_request/entities/service-request.entity';
import { ServiceAssignTo } from 'src/service_request/entities/service-assign-to.entity';
import { WorkOrderType } from 'src/work_order_types/entities/work-order-type.entity';

@Module({
   imports: [TypeOrmModule.forFeature([WorkOrder,WorkOrderType,ServiceAssignTo,ServiceRequest,WorkOrderAssignTo,PartRequest,Customer,LocationMaster,EventLog, Branch, User,WorkOrderTask,TaskAssignment,ServiceContract]),forwardRef(() => AuthModule),
    ProductModule, CustomerProductsModule, ],
  controllers: [WorkOrdersController],
  providers: [WorkOrdersService],
   exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
 
  
 