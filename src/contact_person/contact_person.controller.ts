import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ContactPersonService } from './contact_person.service';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { UpdateContactPersonDto } from './dto/update-contact-person.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('contact-person')
export class ContactPersonController {
    constructor(private readonly contactPersonService: ContactPersonService) {}
//  @UseGuards(AuthGuard('jwt'))
 @UseGuards(AuthGuard('jwt'))
@Post()
  async create(@Body() createDto: CreateContactPersonDto) {
    return this.contactPersonService.create(createDto);
} 
 @UseGuards(AuthGuard('jwt'))
@Get('all')
findAll(@Query('page') page = 1) {
  return this.contactPersonService.findAll(Number(page));
}
 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: number,
  @Query('branchId') branchId?: number,
  @Query('branchName') branchName?: string,
  @Query('name') name?: string,
  @Query('email') email?: string,
  @Query('designation') designation?: string,
    @Query('location_id') location_id?: number,
  @Query('page') page = 1,
  @Query('limit') limit = 10,
) {
  return this.contactPersonService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      branchId: branchId ? Number(branchId) : undefined,
      branchName,
      name,
      email,
      designation,
       location_id: location_id ? Number(location_id) : undefined, 
    },
    Number(page),
    Number(limit),
  );
}
// GET http://localhost:3000/contact-person/filter?id=10
// GET http://localhost:3000/contact-person/filter?branchName=Ahmedabad&designation=Manager
 @UseGuards(AuthGuard('jwt'))
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactPersonService.findOne(id);
}
 @UseGuards(AuthGuard('jwt'))
@Get()
async findByBranchId(@Query('branchId') branchId?: number) {
    if (branchId) {
      return this.contactPersonService.findByBranchId(branchId);
    }
    return this.contactPersonService.findAll();
}
 @UseGuards(AuthGuard('jwt'))
@Put(':id')
update(@Param('id') id: number, @Body() dto: UpdateContactPersonDto) {
  return this.contactPersonService.update(id, dto);
}
// @Put(':id')
// async update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateDto: UpdateContactPersonDto,
//   ) {
//     return this.contactPersonService.update(id, updateDto);
// }
 @UseGuards(AuthGuard('jwt'))
@Delete(':id')
async remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactPersonService.remove(id);
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
         location_id?:number; 
  }) {
    return this.contactPersonService.searchWithPagination(body);
}  
 @UseGuards(AuthGuard('jwt'))
@Patch(':id/status')
  updateBranchStatus(@Param('id') id: string) {
    return this.contactPersonService.updateStatus(+id);
}
}
