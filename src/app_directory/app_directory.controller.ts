import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppDirectoryService } from './app_directory.service';
import { CreateAppDirectoryDto } from './dto/create-app-directory.dto';
import { UpdateAppDirectoryDto } from './dto/update-app-directory.dto';
import { AppDirectory } from './entities/app_directory.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('app-directory')
export class AppDirectoryController {
    constructor(private readonly appDirectoryService: AppDirectoryService) {}
 @UseGuards(AuthGuard('jwt'))
@Post()
async create(@Body() dto: CreateAppDirectoryDto) {
  return this.appDirectoryService.create(dto); 
}
 @UseGuards(AuthGuard('jwt'))
@Put(':id')
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateAppDirectoryDto,
) {
  return this.appDirectoryService.update(id, dto);
}
 @UseGuards(AuthGuard('jwt'))
@Get()
async findAll(): Promise<{
  statusCode: number;
  message: string;
  data: AppDirectory[];
}> {
  return this.appDirectoryService.findAll();
}



 @UseGuards(AuthGuard('jwt'))
@Delete(':id')
async remove(@Param('id', ParseIntPipe) id: number) {
  return this.appDirectoryService.remove(id);
}
 @UseGuards(AuthGuard('jwt'))
    @Post('search')
  searchProducts(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;    
   
  }) {
    return this.appDirectoryService.searchWithPagination(body);
}  
 @UseGuards(AuthGuard('jwt'))
@Patch(':id/status')
  updateAppDirectoryStatus(@Param('id') id: string) {
    return this.appDirectoryService.updateStatus(+id);
}
 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('master_name') master_name?: string,
  @Query('field_value') field_value?: string,
  @Query('description') description?: string,
  @Query('is_active') is_active?: string,
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
  return this.appDirectoryService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      master_name,
      field_value,
      description,
      is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
    },
    Number(page),
    Number(limit),
  );
}

}
