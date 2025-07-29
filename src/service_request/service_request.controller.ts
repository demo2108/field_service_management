import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ServiceRequestService } from './service_request.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { CreateTaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ServiceRequest } from './entities/service-request.entity';
import { SearchServiceRequestDto } from './dto/search-service-request.dto';
import { AuthGuard } from '@nestjs/passport';



@Controller('service-request')
export class ServiceRequestController {
  constructor(private readonly serviceRequestService: ServiceRequestService) { }
 @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createDto: CreateServiceRequestDto) {
    return this.serviceRequestService.create(createDto);
  }

  // @Get()
  // findAll() {
  //   return this.serviceRequestService.findAll();
  // }
 @UseGuards(AuthGuard('jwt'))
  @Get('all')
  findAll(@Query('page') page = 1) {
    return this.serviceRequestService.findAll(Number(page));
  }

 @UseGuards(AuthGuard('jwt'))
  @Get('filter')
  async findByFilters(
    @Query('id') id?: string,
    @Query('work_order_id') work_order_id?: string,
    @Query('service_name_id') service_name_id?: string,
    @Query('engineer_id') engineer_id?: string,
    @Query('created_by') created_by?: string,
    @Query('acknowledged') acknowledged?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('sequence') sequence?: string,
    @Query('is_active') is_active?: string,
    @Query('location_id') location_id?: string,
    @Query('app_dir_id') app_dir_id?: string,
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
    return this.serviceRequestService.findByFilters(
      {
        id: id ? Number(id) : undefined,
        work_order_id: work_order_id ? Number(work_order_id) : undefined,
        service_name_id: service_name_id ? Number(service_name_id) : undefined,
        engineer_id: engineer_id ? Number(engineer_id) : undefined,
        created_by: created_by ? Number(created_by) : undefined,
        acknowledged: acknowledged !== undefined ? acknowledged === 'true' : undefined,
        status,
        priority,
        app_dir_id: app_dir_id ? Number(app_dir_id) : undefined,
        sequence: sequence ? Number(sequence) : undefined,
        is_active: is_active !== undefined ? is_active === 'true' : undefined,
         location_id: parsedLocationId,
      },
      Number(page),
      Number(limit),
    );
  }
  //http://localhost:3000/service-request/filter?id=9
 @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.serviceRequestService.findOne(+id);
  }
 @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateServiceRequestDto,
  ) {
    return this.serviceRequestService.update(id, dto);
  }

 @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.serviceRequestService.remove(+id);
  }
 @UseGuards(AuthGuard('jwt'))
 @Delete('task/:id')
  removetask(@Param('id') id: number) {
    return this.serviceRequestService.removetask(+id);
  }

 @UseGuards(AuthGuard('jwt'))
    @Patch(':id/status')
  updateBranchStatus(@Param('id') id: string) {
    return this.serviceRequestService.updateStatus(+id);
  }
 @UseGuards(AuthGuard('jwt'))
 @Post('search')
  searchBranches(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
     Work_order_id?: number;
     location_id?:number; 
  }) {
    return this.serviceRequestService.searchWithPagination(body);
  }

 @UseGuards(AuthGuard('jwt'))
  @Post('searchtask')
  searchtask(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
     id?: number;
    location_id: number; 
  }) {
    return this.serviceRequestService.searchWithPaginationtask(body);
  }
 @UseGuards(AuthGuard('jwt'))
@Post('search-fields')
async searchByFields(
  @Body() body: SearchServiceRequestDto,
) {
  return this.serviceRequestService.searchByFields(body);
}






  // Task 

  @Post('task')
  async createTask(@Body() dto: CreateTaskDto) {
    return this.serviceRequestService.createTask(dto);
  }

  @Put('task/:id')
  async updateTask(
    @Param('id') taskId: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.serviceRequestService.updateTask(taskId, dto);
  }

  @Get('getTasksByServiceRequestId/:id')
  getTasksByServiceRequestId(@Param('id') id: number) {
    return this.serviceRequestService.getTasksByServiceRequestId(id);
  }

  @Get('engineerByServiceRequestId/:id')
  getEngineerByServiceRequestId(@Param('id') id: number) {
    return this.serviceRequestService.getEngineerByServiceRequestId(id);
  }                  

}
