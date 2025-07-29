import { forwardRef, Module } from '@nestjs/common';
import { AppDirectoryController } from './app_directory.controller';
import { AppDirectoryService } from './app_directory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AppDirectory } from './entities/app_directory.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AppDirectory,LocationMaster,User]),forwardRef(() => AuthModule),],
  controllers: [AppDirectoryController],
  providers: [AppDirectoryService],
   exports: [AppDirectoryService],
})
export class AppDirectoryModule {}
