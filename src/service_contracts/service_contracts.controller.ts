import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ServiceContractsService } from './service_contracts.service';
import { CreateServiceContractDto } from './dto/create-service-contract.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('service-contracts')
export class ServiceContractsController {
    constructor(private readonly serviceContractsService: ServiceContractsService) {}
 @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateServiceContractDto) {
    return this.serviceContractsService.create(dto);
  }

  // @Get()
  // findAll() {
  //   return this.serviceContractsService.findAll();
  // }
 @UseGuards(AuthGuard('jwt'))
 @Get('all')
findAll(@Query('page') page = 1) {
  return this.serviceContractsService.findAll(Number(page));
}

 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('contractType') contractType?: string,
  @Query('start_date') start_date?: string,
  @Query('end_date') end_date?: string,
  @Query('work_order_id') work_order_id?: string,
  @Query('is_active') is_active?: string,
   @Query('location_id') location_id?: string,
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
    const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const parsedLocationId = Number(location_id);
  
  if (!parsedLocationId || isNaN(parsedLocationId)) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be a valid number',
      data: {
        products: [],
        total: 0,
        page: parsedPage,
        totalPages: 0,
      },
    };
  }
  return this.serviceContractsService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      contractType,
      start_date,
      end_date,
      work_order_id: work_order_id ? Number(work_order_id) : undefined,
      is_active: is_active !== undefined ? is_active === 'true' : undefined,
        location_id: parsedLocationId,
    },
    Number(page),
    Number(limit),
  );
}

//http://localhost:3000/service-contracts/filter?contractType=type2
 @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceContractsService.findOne(id);
  }
 @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateServiceContractDto,
  ) {
    return this.serviceContractsService.update(id, dto);
  }
 @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceContractsService.remove(id);
  }
   @UseGuards(AuthGuard('jwt'))
@Patch(':id/status')
updateBranchStatus(@Param('id', ParseIntPipe) id: number) {
  return this.serviceContractsService.updateStatus(id);
}
 @UseGuards(AuthGuard('jwt'))
  @Post('search')
  searchProducts(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
      Work_order_id?: number;
       location_id?: number;

     
   
  }) {
    return this.serviceContractsService.searchWithPagination(body);
}  

}
