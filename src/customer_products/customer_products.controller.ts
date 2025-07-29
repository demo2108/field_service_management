import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { CustomerProductsService } from './customer_products.service';
import { CreateCustomerProductDto } from './dto/create-customer-product.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('customer-products')
export class CustomerProductsController {
      constructor(private readonly customerProductsService: CustomerProductsService) {}
@UseGuards(AuthGuard('jwt'))
@Post()
async create(
  @Body(new ParseArrayPipe({ items: CreateCustomerProductDto, whitelist: true }))
  dtos: CreateCustomerProductDto[],
) {
  return this.customerProductsService.create(dtos);
}

 @UseGuards(AuthGuard('jwt')) 
@Get('all')
findAll(@Query('page') page = 1) {
  return this.customerProductsService.findAll(Number(page));
}

 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('serial_no') serial_no?: string,
  @Query('product_id') product_id?: string,
  @Query('customer_id') customer_id?: string,
  @Query('delivery_date') delivery_date?: string,
  @Query('expiry_date') expiry_date?: string,
  @Query('remarks') remarks?: string,
  @Query('is_active') is_active?: string,
  @Query('work_order_id') work_order_id?: string,
  @Query('installed_by') installed_by?: string,
  @Query('is_active_date') is_active_date?: string,
  @Query('no_of_items') no_of_items?: string,
   @Query('location_id') location_id?: string,
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
  return this.customerProductsService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      serial_no,
      product_id: product_id ? Number(product_id) : undefined,
      customer_id: customer_id ? Number(customer_id) : undefined,
      delivery_date,
      expiry_date,
      remarks,
      is_active: is_active !== undefined ? is_active === 'true' : undefined,
      work_order_id: work_order_id ? Number(work_order_id) : undefined,
      installed_by: installed_by ? Number(installed_by) : undefined,
      is_active_date,
      no_of_items: no_of_items ? Number(no_of_items) : undefined,
       location_id: location_id ? Number(location_id) : undefined,
    },
    Number(page),
    Number(limit),
  );
}



//GET http://localhost:3000/customer-products/filter?customer_id=2&page=1&limit=10
// GET http://localhost:3000/customer-products/filter?customer_id=1&product_id=5
// GET http://localhost:3000/customer-products/filter?id=5
 @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customerProductsService.findOne(id);
  }
 @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCustomerProductDto,
  ) {
    return this.customerProductsService.update(id, dto);
  }
 @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerProductsService.remove(id);
  }
 @UseGuards(AuthGuard('jwt'))
      @Post('search')
  searchProducts(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
     work_oder_id? :number;
     
   
  }) {
    return this.customerProductsService.searchWithPagination(body);
}  
 @UseGuards(AuthGuard('jwt'))
@Patch(':id/status')
  updateBranchStatus(@Param('id') id: string) {
    return this.customerProductsService.updateStatus(+id);
}
}
