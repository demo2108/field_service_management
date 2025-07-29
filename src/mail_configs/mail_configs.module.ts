import { forwardRef, Module } from '@nestjs/common';
import { MailConfigsController } from './mail_configs.controller';
import { MailConfigsService } from './mail_configs.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailConfig } from './entities/mail-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MailConfig]),forwardRef(() => AuthModule),],
  controllers: [MailConfigsController],
  providers: [MailConfigsService],
  exports: [MailConfigsService],
})
export class MailConfigsModule {}


   
 
