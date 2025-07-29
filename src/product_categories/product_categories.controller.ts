import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductCategoriesService } from './product_categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('product-categories')
export class ProductCategoriesController {
     constructor(private readonly productCategoriesService: ProductCategoriesService) {}
 @UseGuards(AuthGuard('jwt'))
  @Post()  
  create(@Body() createDto: CreateProductCategoryDto) {
    return this.productCategoriesService.create(createDto);
  }

  // @Get()
  // findAll() {
  //   return this.productCategoriesService.findAll();
  // }
 @UseGuards(AuthGuard('jwt'))
@Get('all')
findAll(@Query('page') page = 1) {
  return this.productCategoriesService.findAll(Number(page));
}
 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('name') name?: string,
  @Query('club_code') club_code?: string,
  @Query('created_at') created_at?: string, 
   @Query('is_active') is_active?: string,
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
  return this.productCategoriesService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      name,
      club_code,
      created_at,
        is_active: is_active !== undefined ? is_active === 'true' : undefined,
         location_id: parsedLocationId,
    },
    Number(page),
    Number(limit),
  );                        
}    
//http://localhost:3000/product-categories/filter?club_code=ELEC001
 @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoriesService.findOne(+id);
  }
 @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update( @Param('id') id: string,@Body() updateDto: UpdateProductCategoryDto) {
    return this.productCategoriesService.update(+id, updateDto);
  }

 @UseGuards(AuthGuard('jwt'))
  @Delete(':id') 
  remove(@Param('id') id: string) {
    return this.productCategoriesService.remove(+id);
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
    return this.productCategoriesService.searchWithPagination(body);
}  
 @UseGuards(AuthGuard('jwt'))
@Patch(':id/status')
  updateBranchStatus(@Param('id') id: string) {
    return this.productCategoriesService.updateStatus(+id);
}
}
