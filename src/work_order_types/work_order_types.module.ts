import { forwardRef, Module } from '@nestjs/common';
import { WorkOrderTypesController } from './work_order_types.controller';
import { WorkOrderTypesService } from './work_order_types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderType } from './entities/work-order-type.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
   imports: [TypeOrmModule.forFeature([WorkOrderType,LocationMaster,User]),forwardRef(() => AuthModule),],
  controllers: [WorkOrderTypesController],
  providers: [WorkOrderTypesService],
  exports: [WorkOrderTypesService],
})
export class WorkOrderTypesModule {}



