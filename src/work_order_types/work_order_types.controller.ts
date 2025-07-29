import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { WorkOrderTypesService } from './work_order_types.service';
import { CreateWorkOrderTypeDto } from './dto/create-work-order-type.dto';
import { UpdateWorkOrderTypeDto } from './dto/update-work-order-type.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('work-order-types')
export class WorkOrderTypesController {
    constructor(private readonly workOrderTypeService: WorkOrderTypesService) {}
 @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateWorkOrderTypeDto) {
    return this.workOrderTypeService.create(dto);
  }
   @UseGuards(AuthGuard('jwt'))
  @Put(':id')
async update(
  @Param('id') id: string,
  @Body() dto: UpdateWorkOrderTypeDto,
) {
  return this.workOrderTypeService.update(+id, dto);
}
 @UseGuards(AuthGuard('jwt'))
@Delete(':id')
deleteWorkOrderType(@Param('id') id: string) {
  return this.workOrderTypeService.delete(+id);
}
 @UseGuards(AuthGuard('jwt'))
@Get('all')
getAll(@Query('page') page = 1) {
  return this.workOrderTypeService.findAll(Number(page));
}
 @UseGuards(AuthGuard('jwt'))
@Post('search')
  searchBranches(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
     BranchId?: number; 
      location_id?: number;
  }) {
    return this.workOrderTypeService.searchWithPagination(body);
}  
 @UseGuards(AuthGuard('jwt'))
@Patch(':id/status')
  updateBranchStatus(@Param('id') id: string) {
    return this.workOrderTypeService.updateStatus(+id);
}
 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('type') type?: string,
  @Query('capacity') capacity?: string,
  @Query('height') height?: string,
  @Query('width') width?: string,
  @Query('no_of_loadshell') noOfLoadshell?: string,
  @Query('is_active') isActive?: string,
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
  return this.workOrderTypeService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      type,
      capacity,
      height,
      width,
      no_of_loadshell: noOfLoadshell ? Number(noOfLoadshell) : undefined,
      is_active: isActive !== undefined ? isActive === 'true' : undefined,
       location_id: parsedLocationId,
    },
    Number(page),
    Number(limit),
  );
}
 @UseGuards(AuthGuard('jwt'))
  @Get('all')
  findAll(@Query('page') page = 1) {
    return this.workOrderTypeService.findAll(Number(page));
  }
}
