import { forwardRef, Module } from '@nestjs/common';
import { ServiceContractsController } from './service_contracts.controller';
import { ServiceContractsService } from './service_contracts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceContract } from './entities/service-contract.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import { AppDirectory } from 'src/app_directory/entities/app_directory.entity';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ServiceContract,LocationMaster,User,AppDirectory,EventLog]),forwardRef(()=>AuthModule),],
  controllers: [ServiceContractsController],
  providers: [ServiceContractsService],
  exports:[ServiceContractsService],
})
export class ServiceContractsModule {}
 