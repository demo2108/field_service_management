import { forwardRef, Module } from '@nestjs/common';
import { ServiceRequestSummaryController } from './service_request_summary.controller';
import { ServiceRequestSummaryService } from './service_request_summary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ServiceRequestSummary } from './entities/service-request-summary.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ServiceRequestSummary]), forwardRef(()=>AuthModule)],
  controllers: [ServiceRequestSummaryController],
  providers: [ServiceRequestSummaryService],
  exports:[ServiceRequestSummaryService]
})
export class ServiceRequestSummaryModule {}
