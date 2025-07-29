import { forwardRef, Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './entities/attachment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import { User } from 'src/users/entities/user.entity';
import { ServiceRequest } from 'src/service_request/entities/service-request.entity';
import { SignatureMaster } from './entities/signature_master.entity';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Attachment,WorkOrder,EventLog,User,ServiceRequest,SignatureMaster]),forwardRef(()=>AuthModule),],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
    exports:[AttachmentsService]
})
export class AttachmentsModule {}

