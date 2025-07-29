// src/users/users.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { MailModule } from './mail.module';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User,LocationMaster,EventLog]),MailModule,forwardRef(() => AuthModule),],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
