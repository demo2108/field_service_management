import { forwardRef, Module } from '@nestjs/common';
import { ScheduleConfigController } from './schedule_config.controller';
import { ScheduleConfigService } from './schedule_config.service';
import { ScheduleConfig } from './entities/schedule_config.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports:[TypeOrmModule.forFeature([ScheduleConfig]),forwardRef(()=>AuthModule),],
  controllers: [ScheduleConfigController],
  providers: [ScheduleConfigService],
    exports:[ScheduleConfigService]
})
export class ScheduleConfigModule {}




