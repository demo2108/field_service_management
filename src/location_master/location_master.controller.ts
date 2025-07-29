import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { LocationMasterService } from './location_master.service';
import { CreateLocationDto } from './dto/create-location-master.dto';
import { UpdateLocationDto } from './dto/update-location-master.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('location-master')
export class LocationMasterController {
    constructor(private readonly locationService: LocationMasterService) {}
 @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateLocationDto) {
    return this.locationService.create(dto);
  }
 @UseGuards(AuthGuard('jwt'))
@Put(':id')
async update(
  @Param('id') id: number,
  @Body() dto: UpdateLocationDto,
) {
  return this.locationService.update(id, dto);
}
 @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async findAll() {
    return this.locationService.findAll();
  }
   @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.delete(id);
  }

   @UseGuards(AuthGuard('jwt'))
    @Patch(':id/status')
  updateBranchStatus(@Param('id') id: string) {
    return this.locationService.updateStatus(+id);
  }
 @UseGuards(AuthGuard('jwt'))
   @Post('search')
  searchBranches(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;

  }) {
    return this.locationService.searchWithPagination(body);
  }
   @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findLocationsByFilter(
  @Query('id') id?: string,
  @Query('name') name?: string,
  @Query('location_code') location_code?: string,
  @Query('contact_no') contact_no?: string,
  @Query('address') address?: string,
  @Query('is_active') is_active?: string,
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
  let parsedId: number | undefined = undefined;
  if (id && id.trim() !== '') {
    const num = Number(id);
    if (!isNaN(num)) {
      parsedId = num;
    } else {
      return {
        statusCode: 400,
        message: 'Invalid value for "id" filter',
        data: {
          locations: [],
          total: 0,
          page: Number(page),
        },
      };
    }
  }

  return this.locationService.findByFilters(
    {
      id: parsedId,
      name,
      location_code,
      contact_no,
      address,
      is_active,
    },
    Number(page),
    Number(limit),
  );
}

}
