import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { EngineerEventLogService } from './engineer_event_log.service';
import { CreateEventLogDto } from './dto/create-event-log.dto';
import { UpdateExitTimeDto } from './dto/update-exit-time.dto';
import { SearchEventLogDto } from './dto/search-event-log.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('engineer-event-log')
export class EngineerEventLogController {
      constructor(private readonly eventLogService: EngineerEventLogService) {}
@UseGuards(AuthGuard('jwt'))
@Get()
@UsePipes(new ValidationPipe({ transform: true }))
async findAll(@Query() searchDto: SearchEventLogDto) {
  const logs = await this.eventLogService.findAll(searchDto);
  return {
    statusCode: 200,
    message: 'Event logs retrieved successfully',
    data: logs,
  };
}
}
