import { forwardRef, Module } from '@nestjs/common';
import { ServiceTypesController } from './service_types.controller';
import { ServiceTypesService } from './service_types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceType } from './entities/service-type.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';

@Module({
   imports: [TypeOrmModule.forFeature([ServiceType,User]),forwardRef(() => AuthModule),],
  controllers: [ServiceTypesController],
  providers: [ServiceTypesService],
   exports: [ServiceTypesService],
})
export class ServiceTypesModule {}
