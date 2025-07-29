import { forwardRef, Module } from '@nestjs/common';
import { EngineerEventLogController } from './engineer_event_log.controller';
import { EngineerEventLogService } from './engineer_event_log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLog } from './entities/event_log.entity';
import { AuthModule } from 'src/auth/auth.module';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import { ServiceRequest } from 'src/service_request/entities/service-request.entity';

@Module({
   imports:[TypeOrmModule.forFeature([EventLog, WorkOrder, ServiceRequest]),forwardRef(()=>AuthModule),],
  controllers: [EngineerEventLogController],
  providers: [EngineerEventLogService],
   exports:[EngineerEventLogService],
})
export class EngineerEventLogModule {}
