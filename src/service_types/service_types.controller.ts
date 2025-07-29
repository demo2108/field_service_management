import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ServiceTypesService } from './service_types.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('service-types')
export class ServiceTypesController {
    constructor(private readonly serviceTypeService: ServiceTypesService) {}
 @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateServiceTypeDto) {
    return this.serviceTypeService.create(dto);
  }

  // @Get()
  // findAll() {
  //   return this.serviceTypeService.findAll();
  // }
 @UseGuards(AuthGuard('jwt'))
@Get('all')
findAll(@Query('page') page = 1) {
  return this.serviceTypeService.findAll(Number(page));
}
 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('name') name?: string,
  @Query('description') description?: string,
  @Query('created_by') createdBy?: string,
  @Query('updated_by') updatedBy?: string,
  @Query('created_at') createdAt?: string,
  @Query('updated_at') updatedAt?: string,
  @Query('is_active') isActive?: string,
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
  return this.serviceTypeService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      name,
      description,
      createdBy: createdBy ? Number(createdBy) : undefined,
      updatedBy: updatedBy ? Number(updatedBy) : undefined,
      createdAt,
      updatedAt,
      isActive: isActive != null ? isActive === 'true' : undefined,
    },
    Number(page),
    Number(limit),
  );
}

//http://localhost:3000/service-types/filter?is_active=true&page=1&limit=5
 @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.serviceTypeService.findOne(id);
    if (!result) {
      throw new NotFoundException(`ServiceType with ID ${id} not found`);
    }
    return result;
  }
 @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceTypeDto,
  ) {
    return this.serviceTypeService.update(id, dto);
  }
 @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceTypeService.remove(id);
  }
}
