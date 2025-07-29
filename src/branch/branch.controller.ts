import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { AuthService } from 'src/auth/auth.service';
import { UpdateBranchStatusDto } from './dto/update-branch-status.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('branch')
export class BranchController {
    constructor(private readonly branchService: BranchService,
         private readonly authService: AuthService
    ) {}
 @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateBranchDto) {
    return this.branchService.create(dto);
  }
   @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.branchService.update(id, dto);
  }
   @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.delete(id);
  }
   @UseGuards(AuthGuard('jwt'))
  @Get('all')
  getAll(@Query('page') page = 1) {
   return this.branchService.getAll(Number(page));
  }
//   @Get('filter')
//   async findBranchesByFilter(
//   @Query('id') id?: string,
//   @Query('branch_name') branch_name?: string,
//   @Query('city') city?: string,
//   @Query('country') country?: string,
//   @Query('pincode') pincode?: string,
//   @Query('address') address?: string,
//   @Query('state') state?: string,
//   @Query('location_id') location_id?: string,
//   @Query('page') page = '1',
//   @Query('limit') limit = '10',
// ) {

//     let parsedId: number | undefined = undefined;
//   if (id !== undefined && id.trim() !== '') {
//     const num = Number(id);
//     if (!isNaN(num)) {
//       parsedId = num;
//     } else {
//       return {
//         statusCode: 400,
//         message: 'Invalid value for "id" filter',
//         data: {
//           branches: [],
//           total: 0,
//           page: Number(page),
//         },
//       };
//     }
//   }
  
//   return this.branchService.findByFilters(
//     {
//      id: parsedId,
//       branch_name,
//       city,
//       country,
//       pincode,
//       address,
//       state,
//     },
//     Number(page),
//     Number(limit),
//   );
//   }
 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findBranchesByFilter(
  @Query('id') id?: string,
  @Query('branch_name') branch_name?: string,
  @Query('city') city?: string,
  @Query('country') country?: string,
  @Query('pincode') pincode?: string,
  @Query('address') address?: string,
  @Query('state') state?: string,
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

  if (isNaN(parsedPage) || isNaN(parsedLimit)) {
    return {
      statusCode: 400,
      message: 'Invalid pagination parameters',
      data: {
        branches: [],
        total: 0,
        page: 1,
      },
    };
  }

  let parsedId: number | undefined = undefined;
  if (id !== undefined && id.trim() !== '') {
    const num = Number(id);
    if (!isNaN(num)) {
      parsedId = num;
    } else {
      return {
        statusCode: 400,
        message: 'Invalid value for "id" filter',
        data: {
          branches: [],
          total: 0,
          page: parsedPage,
        },
      };
    }
  }

  // let parsedLocationId: number | undefined = undefined;
  // if (location_id !== undefined && location_id.trim() !== '') {
  //   const num = Number(location_id);
  //   if (!isNaN(num)) {
  //     parsedLocationId = num;
  //   } else {
  //     return {
  //       statusCode: 400,
  //       message: 'Invalid value for "location_id" filter',
  //       data: {
  //         branches: [],
  //         total: 0,
  //         page: parsedPage,
  //       },
  //     };
  //   }
  //}

  return this.branchService.findByFilters(
    {
      id: parsedId,
      branch_name,
      city,
      country,
      pincode,
      address,
      state,
      location_id: parsedLocationId,
    },
    parsedPage,
    parsedLimit,
  );
}


//http://localhost:3000/branch/filter?city=New York&page=5&limit=10
 @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.getById(id);
  }
   @UseGuards(AuthGuard('jwt'))
 @Post('search')
  searchBranches(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
     CustomerId?: number; 
      location_id?:number; 
     
  }) {
    return this.branchService.searchWithPagination(body);
  }
 @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
updateBranchStatus(@Param('id') id: string) {
  return this.branchService.updateStatus(+id);
}

}
