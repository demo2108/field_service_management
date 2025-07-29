import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventLog } from './entities/event_log.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateEventLogDto } from './dto/create-event-log.dto';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import { ServiceRequest } from 'src/service_request/entities/service-request.entity';
import { UpdateExitTimeDto } from './dto/update-exit-time.dto';
import { SearchEventLogDto } from './dto/search-event-log.dto';

@Injectable()
export class EngineerEventLogService {
   constructor(
    @InjectRepository(EventLog)
    private readonly eventLogRepo: Repository<EventLog>,

    @InjectRepository(WorkOrder)
    private readonly workOrderRepo: Repository<WorkOrder>,

    @InjectRepository(ServiceRequest)
    private readonly serviceRequestRepo: Repository<ServiceRequest>,
  ) {}

 // engineer_event_log.service.ts

async findAll(searchDto: SearchEventLogDto): Promise<EventLog[]> {
  const query = this.eventLogRepo.createQueryBuilder('event_log');

  if (searchDto.work_order_id) {
    query.andWhere('event_log.work_order_id = :work_order_id', {
      work_order_id: searchDto.work_order_id,
    });
  }

  if (searchDto.service_request_id) {
    query.andWhere('event_log.service_request_id = :service_request_id', {
      service_request_id: searchDto.service_request_id,
    });
  }

  if (searchDto.location_id) {
    query.andWhere('event_log.location_id = :location_id', {
      location_id: searchDto.location_id,
    });
  }

  if (searchDto.user_id) {
    query.andWhere('event_log.user_id = :user_id', {
      user_id: searchDto.user_id,
    });
  }
 if (searchDto.attachment_id) {
    query.andWhere('event_log.attachment_id = :attachment_id', {
      attachment_id: searchDto.attachment_id,
    });
  }

   if (searchDto.product_id) {
    query.andWhere('event_log.product_id = :product_id', {
      product_id: searchDto.product_id,
    });
  }
   if (searchDto.service_contract_id) {
    query.andWhere('event_log.service_contract_id = :service_contract_id', {
      service_contract_id: searchDto.service_contract_id,
    });
  }

  query.orderBy('event_log.changed_at', 'DESC');

  const result = await query.getMany();

  if (!result || result.length === 0) {
    throw new NotFoundException('No event logs found for the given criteria');
  }

  return result;
}







}
