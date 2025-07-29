import { forwardRef, Module } from '@nestjs/common';
import { ServiceRequestController } from './service_request.controller';
import { ServiceRequestService } from './service_request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ServiceRequest } from './entities/service-request.entity';
import { ServiceAssignTo } from './entities/service-assign-to.entity';
import { ServiceRequestTask } from './entities/service-request-task.entity';
import { ServiceRequestTaskAssignment } from './entities/service-request-task-assignments.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { AppDirectory } from 'src/app_directory/entities/app_directory.entity';
import { User } from 'src/users/entities/user.entity';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';
import { WorkOrderType } from 'src/work_order_types/entities/work-order-type.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ServiceRequest,WorkOrderType,ServiceAssignTo,EventLog,AppDirectory,User,LocationMaster,ServiceAssignTo,ServiceRequestTask,ServiceRequestTaskAssignment]),forwardRef(()=>AuthModule),],
  controllers: [ServiceRequestController],
  providers: [ServiceRequestService],
  exports:[ServiceRequestService]
})
export class ServiceRequestModule {}
