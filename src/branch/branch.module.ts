import { forwardRef, Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { Branch } from './entities/branch.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerModule } from 'src/customer/customer.module';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch,LocationMaster,User]),CustomerModule,forwardRef(() => AuthModule),],
  controllers: [BranchController],
  providers: [BranchService],
  exports:[BranchService]
})
export class BranchModule {}
