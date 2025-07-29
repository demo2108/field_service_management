import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ServiceRequestSummaryService } from './service_request_summary.service';
import { CreateServiceRequestSummaryDto } from './dto/create-service-request-summary.dto';
import { UpdateServiceRequestSummaryDto } from './dto/update-service-request-summary.dto';

@Controller('service-request-summary')
export class ServiceRequestSummaryController {
      constructor(
    private readonly serviceRequestSummaryService: ServiceRequestSummaryService,
  ) {}

  @Post()
  create(@Body() dto: CreateServiceRequestSummaryDto) {
    return this.serviceRequestSummaryService.create(dto);
  }

  // @Get()
  // findAll() {
  //   return this.serviceRequestSummaryService.findAll();
  // }

 @Get('all')
findAll(@Query('page') page = 1) {
  return this.serviceRequestSummaryService.findAll(Number(page));
}


@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('customer_product_id') customerProductId?: string,
  @Query('remark') remark?: string,
  @Query('repair') repair?: string,
  @Query('part_id') partId?: string,
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
  return this.serviceRequestSummaryService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      customer_product_id: customerProductId ? Number(customerProductId) : undefined,
      remark,
      repair: repair !== undefined ? repair === 'true' : undefined,
      part_id: partId ? Number(partId) : undefined,
    },
    Number(page),
    Number(limit),
  );
}
//http://localhost:3000/service-request-summary/filter?id=9&repair=true

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceRequestSummaryService.findOne(id);
  }

 @Put(':id')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateServiceRequestSummaryDto,   // ← ensure @Body() is present
) {
  return this.serviceRequestSummaryService.update(id, dto);
}


  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceRequestSummaryService.remove(id);
  }
}
