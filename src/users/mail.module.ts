// @Module({
//   providers: [MailService],
//   exports: [MailService], // ✅ Export to be used in other modules
// })
// export class MailModule {}
// src/users/users.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { MailService } from './mail.service';


@Module({
 // imports: [TypeOrmModule.forFeature([MailService]),forwardRef(() => AuthModule),],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule  {}
