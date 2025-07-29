import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('product')
export class ProductController {
     constructor(private readonly productService: ProductService) {}
 @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
   @UseGuards(AuthGuard('jwt'))
 @Get('all')
findAll(@Query('page') page = 1) {
  return this.productService.findAll(Number(page));
}
 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('type_id') type_id?: string,
  @Query('name') name?: string,
  @Query('model_number') model_number?: string,
  @Query('expiry_date') expiry_date?: string,
  @Query('is_active') is_active?: string,
  @Query('replacement_of') replacement_of?: string,
  @Query('club_code') club_code?: string,
    @Query('make') make?: string,
  @Query('contract_type') contract_type?: string,
  @Query('duration') duration?: string,
    @Query('product_code') product_code?: string,
  @Query('work_order_type') work_order_type?: string, 
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
  return this.productService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      type_id: type_id ? Number(type_id) : undefined,
      name,
      model_number,
      make,
      contract_type,
      duration,
      expiry_date,
      is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
      replacement_of: replacement_of ? Number(replacement_of) : undefined,
      club_code,
      product_code,
      work_order_type: work_order_type
        ? work_order_type
            .split(',')
            .map((v) => Number(v.trim()))
            .filter((v) => !isNaN(v))
        : undefined,
           location_id: parsedLocationId,
    },
    Number(page),
    Number(limit),
  );
}
//http://localhost:3000/product/filter?model_number=BB-20247
 @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }
   @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: Partial<CreateProductDto>, // or use UpdateProductDto
  ) {
    return this.productService.update(id, updateProductDto);
  }
   @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
   @UseGuards(AuthGuard('jwt'))
      @Post('search')
  searchProducts(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
       location_id?: number;
   
  }) {
    return this.productService.searchWithPagination(body);
}  
 @UseGuards(AuthGuard('jwt'))
@Patch(':id/status')
  updateBranchStatus(@Param('id') id: string) {
    return this.productService.updateStatus(+id);
}
}
