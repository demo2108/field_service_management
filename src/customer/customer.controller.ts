import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer-dto';
import { UpdateCustomerStatusDto } from './dto/update-customer-status.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService,
    private readonly authService: AuthService
  ) { }

 @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }
   @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateCustomerDto) {
    return this.customerService.update(+id, dto);
  }
   @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.customerService.delete(+id);
  }
   @UseGuards(AuthGuard('jwt'))
  @Get('all')
  findAll(@Query('page') page = 1) {
    return this.customerService.findAll(Number(page));
  }
 @UseGuards(AuthGuard('jwt'))
  @Get('filter')
  async findByFilters(
    @Query('id') id?: string,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('address') address?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('country') country?: string,
    @Query('contact_person') contact_person?: string,
    @Query('company_code') company_code?: string,
    @Query('location_id') location_id?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.customerService.findByFilters(
      {
        id: id ? Number(id) : undefined,
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        contact_person,
        company_code,
        location_id: location_id ? Number(location_id) : undefined,
      },
      Number(page),
      Number(limit),
    );
  }
   @UseGuards(AuthGuard('jwt'))
@Post('search')
searchCustomers(@Body() body: {
  Page: number;
  PageSize: number;
  StartDate?: string;
  EndDate?: string;
  Search?: string;
  location_id?: number;
}) {
  return this.customerService.searchWithPagination(body);
}


 @UseGuards(AuthGuard('jwt'))
@Patch(':id/status')
updateStatus(@Param('id') id: string) {
  return this.customerService.updateStatus(+id);
}

  //http://localhost:3000/customer/filter?name=John D. Updated&city=Springfield
}

