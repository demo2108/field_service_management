import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { WorkOrdersService } from './work_orders.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { CreateTaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateWorkOrderStatusDto } from './dto/update-workorder-status.dto';

@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) { }
 @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createWorkOrderDto: CreateWorkOrderDto) {
    return this.workOrdersService.create(createWorkOrderDto);
  }
 @UseGuards(AuthGuard('jwt'))
  @Get('all')
  findAll(@Query('page') page = 1) {
    return this.workOrdersService.findAll(Number(page));
  }
 @UseGuards(AuthGuard('jwt'))
  @Get('filter')
  async findByFilters(
    @Query('id') id?: string,
    @Query('customer_id') customerId?: string,
    @Query('branch_id') branchId?: string,
    @Query('work_order_id') workOrderID?: string,
    @Query('priority') priority?: string,
    @Query('status') status?: string,
    @Query('hold_reason') holdReason?: string,
    @Query('for') forField?: string,
    @Query('contact_person') contactPerson?: string,
    @Query('contact_person_no') contactPersonNo?: string,         
    @Query('description') description?: string,
    @Query('target_completion_date') targetCompletionDate?: string,
    @Query('created_by') createdBy?: string,
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
    return this.workOrdersService.findByFilters(
      {
        id: id ? Number(id) : undefined, 
        customerId: customerId ? Number(customerId) : undefined,
        branchId: branchId ? Number(branchId) : undefined,
        workOrderID,
        priority,      
        status,
        holdReason,
        forField,
        contactPerson,
        contactPersonNo,  
        description,
        targetCompletionDate,
        createdBy: createdBy ? Number(createdBy) : undefined,
        location_id: parsedLocationId,
      },
      Number(page),
      Number(limit),
    );
  }            

  //GET /work-orders/filter?customer_id=2&priority=High
   @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workOrdersService.findOne(id);
  }
   @UseGuards(AuthGuard('jwt'))
  @Get('by-work-order/:id')
  getByWorkOrderId(@Param('id') id: number) {
    return this.workOrdersService.getTasksByWorkOrderIdQB(+id);
  }  

 @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateWorkOrderDto
  ) {
    return this.workOrdersService.update(id, updateDto);
  }
 @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.workOrdersService.remove(id);
  }
  // work-order.controller.ts
   @UseGuards(AuthGuard('jwt'))
  @Post('task')
  async addTask(@Body() dto: CreateTaskDto) {
    return this.workOrdersService.createTask(dto);
  }
   @UseGuards(AuthGuard('jwt'))
  // work-order.controller.ts
  @Put('task/:id')
  async updateTask(
    @Param('id') taskId: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.workOrdersService.updateTask(taskId, dto);
  }


  //  @Get('workorder/:id')
  //   async getTaskByWorkOrderId123(@Param('id') id: number) {
  //     const tasks = await this.workOrdersService.getTasksByWorkOrderId(id);
  //     return {
  //       message: 'Tasks fetched successfully',
  //       tasks,
  //     };
  //   } 
 @UseGuards(AuthGuard('jwt'))
  @Get('taskByWorkOrderId/:id')
  getTaskByWorkOrderId(@Param('id') id: number) {
    return this.workOrdersService.getTasksByWorkOrderId(id);
  }
 @UseGuards(AuthGuard('jwt'))
  @Get('engineerByWorkOrderId/:id')
  getEngineerByWorkOrderId(@Param('id') id: number) {
    return this.workOrdersService.getEngineerByWorkOrderId(id);
  }
 @UseGuards(AuthGuard('jwt'))
  @Get('serviceContactsByWorkOrderId/:id')
  getServiceContactsByWorkOrderId(@Param('id') id: number) {
    return this.workOrdersService.getServiceContactsByWorkOrderId(id);
  }
  
 @UseGuards(AuthGuard('jwt'))
    @Post('search')
  searchWO(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
     location_id?: number;
  
  }) {
    return this.workOrdersService.searchWithPagination(body);
}  
 @UseGuards(AuthGuard('jwt'))
@Patch(':id/status')
  updateBranchStatus(@Param('id') id: string) {
    return this.workOrdersService.updateStatus(+id);
}
@Patch('update-status')
async updateStatus(@Body() dto: UpdateWorkOrderStatusDto) {
  return await this.workOrdersService.updatewoStatus(dto);
}

}
