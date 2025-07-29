import { forwardRef, Module } from '@nestjs/common';
import { PartRequestsController } from './part_requests.controller';
import { PartRequestsService } from './part_requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartRequest } from './entities/part-request.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([PartRequest]),forwardRef(()=>AuthModule),],
  controllers: [PartRequestsController],
  providers: [PartRequestsService],
  exports:[PartRequestsService],
})
export class PartRequestsModule {}
