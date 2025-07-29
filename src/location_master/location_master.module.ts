import { forwardRef, Module } from '@nestjs/common';
import { LocationMasterController } from './location_master.controller';
import { LocationMasterService } from './location_master.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationMaster } from './entities/location-master.entity';
import { CustomerModule } from 'src/customer/customer.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
   imports: [TypeOrmModule.forFeature([LocationMaster]),CustomerModule,forwardRef(() => AuthModule),],
  controllers: [LocationMasterController],
  providers: [LocationMasterService],
    exports:[LocationMasterService]
})
export class LocationMasterModule {}
