import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ScheduleConfigService } from './schedule_config.service';
import { CreateScheduleConfigDto } from './dto/create-schedule-config.dto';
import { UpdateScheduleConfigDto } from './dto/update-schedule-config.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('schedule-config')
export class ScheduleConfigController {
     constructor(private readonly scheduleConfigService: ScheduleConfigService) {}
 @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateScheduleConfigDto) {
    return this.scheduleConfigService.create(dto);
  }
 @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScheduleConfigDto,
  ) {
    return this.scheduleConfigService.update(id, dto);
  }
   @UseGuards(AuthGuard('jwt'))
@Get('all')
findAll(@Query('page') page = 1) {
  return this.scheduleConfigService.findAll(Number(page));
}
 @UseGuards(AuthGuard('jwt'))
@Delete(':id')
async remove(@Param('id') id: number) {
  return this.scheduleConfigService.remove(Number(id));
}
 @UseGuards(AuthGuard('jwt'))
@Post('search')
searchPart(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
    //location_id?: number;
  }) {
    return this.scheduleConfigService.searchWithPagination(body);
  }  


//   @Get('filter')
// async findByFilters(
//   @Query('id') id?: string,
//   @Query('schedule_type') schedule_type?: string,
//   @Query('step') step?: string,
//   @Query('mail_to') mail_to?: string,
//   @Query('mail_subject') mail_subject?: string,
//   @Query('mail_body') mail_body?: string,
//   @Query('page') page = '1',
//   @Query('limit') limit = '10',
// ) {
//   return this.scheduleConfigService.findByFilters(
//     {
//       id: id ? Number(id) : undefined,
      
    
//     },
//     Number(page),
//     Number(limit),
//   );
// }
 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('schedule_type') schedule_type?: string,
  @Query('step') step?: string,
  @Query('mail_to') mail_to?: string,
  @Query('mail_subject') mail_subject?: string,
  @Query('mail_body') mail_body?: string,
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
  return this.scheduleConfigService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      schedule_type,
      step,
      mail_to,
      mail_subject,
      mail_body,
    },
    Number(page),
    Number(limit),
  );
}

}
