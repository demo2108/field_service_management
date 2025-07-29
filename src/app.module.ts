import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserroleModule } from './userrole/userrole.module';
import { Role } from './userrole/entities/role.entity';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/entities/customer.entity';
import { BranchModule } from './branch/branch.module';
import { Branch } from './branch/entities/branch.entity';
import { ContactPersonModule } from './contact_person/contact_person.module';
import { ContactPerson } from './contact_person/entities/contact_per.entity';
import { ProductCategoriesModule } from './product_categories/product_categories.module';
import { ProductCategory } from './product_categories/entities/product-category.entity';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { WorkOrdersModule } from './work_orders/work_orders.module';
import { WorkOrder } from './work_orders/entities/work-order.entity';
import { CustomerProductsModule } from './customer_products/customer_products.module';
import { CustomerProduct } from './customer_products/entities/customer-product.entity';
import { ServiceTypesModule } from './service_types/service_types.module';
import { ServiceType } from './service_types/entities/service-type.entity';
import { ServiceContractsModule } from './service_contracts/service_contracts.module';
import { ServiceContract } from './service_contracts/entities/service-contract.entity';
import { ServiceRequestModule } from './service_request/service_request.module';
import { ServiceRequest } from './service_request/entities/service-request.entity';
import { PartRequestsModule } from './part_requests/part_requests.module';
import { PartRequest } from './part_requests/entities/part-request.entity';
import { ServiceRequestSummaryModule } from './service_request_summary/service_request_summary.module';
import { ServiceRequestSummary } from './service_request_summary/entities/service-request-summary.entity';
import { LocationModule } from './current_location/location.module';
import { EngineerEventLogModule } from './engineer_event_log/engineer_event_log.module';
import { EventLog } from './engineer_event_log/entities/event_log.entity';
import { WorkOrderAssignTo } from './work_orders/entities/workorder_assignto.entity';
import { ServiceAssignTo } from './service_request/entities/service-assign-to.entity';
import { TaskAssignment } from './work_orders/entities/task_assignments.entity';
import { WorkOrderTask } from './work_orders/entities/work_order_tasks.entity';
import { ServiceRequestTask } from './service_request/entities/service-request-task.entity';
import { ServiceRequestTaskAssignment } from './service_request/entities/service-request-task-assignments.entity';
import { WorkOrderTypesModule } from './work_order_types/work_order_types.module';
import { WorkOrderType } from './work_order_types/entities/work-order-type.entity';
import { AppDirectoryModule } from './app_directory/app_directory.module';
import { AppDirectory } from './app_directory/entities/app_directory.entity';
import { LocationMasterModule } from './location_master/location_master.module';
import { LocationMaster } from './location_master/entities/location-master.entity';
import { AttachmentsModule } from './attachments/attachments.module';
import { Attachment } from './attachments/entities/attachment.entity';
//import { MailModule } from './mail/mail.module';
import { MailConfigsModule } from './mail_configs/mail_configs.module';
import { MailConfig } from './mail_configs/entities/mail-config.entity';
import { ScheduleConfigModule } from './schedule_config/schedule_config.module';
import { ScheduleConfig } from './schedule_config/entities/schedule_config.entity';
import { SignatureMaster } from './attachments/entities/signature_master.entity';
// ... other imports

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
       type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgresql',
      database: 'FieldServiceManagementDB',
      entities: [User ,Role,Customer,ScheduleConfig,Branch,ContactPerson,ProductCategory,Product,WorkOrder,CustomerProduct,
        ServiceType,ServiceContract,WorkOrderType,SignatureMaster,MailConfig,ServiceRequest,TaskAssignment,WorkOrderTask,Attachment,LocationMaster,PartRequest,ServiceRequestSummary,EventLog,WorkOrderAssignTo,AppDirectory,ServiceAssignTo,ServiceRequestTask,ServiceRequestTaskAssignment],
      synchronize: false, 
        extra: {
    max: 10, // 👈 Add this line to limit max connections per instance
  },
      
    }),
    UsersModule,     
    AuthModule,
    UserroleModule, 
    CustomerModule,
    BranchModule,
    ContactPersonModule,
    ProductCategoriesModule,
    ProductModule,
    WorkOrdersModule,
    CustomerProductsModule,
    ServiceTypesModule,
    ServiceContractsModule,
    ServiceRequestModule,
    PartRequestsModule,
    ServiceRequestSummaryModule,
    LocationModule,
    EngineerEventLogModule,
    WorkOrderTypesModule,
    AppDirectoryModule,
    LocationMasterModule,
    AttachmentsModule,
    MailConfigsModule,
    ScheduleConfigModule    
  ],  
})
export class AppModule {}
