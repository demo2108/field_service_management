// src/users/users.controller.ts
import { Controller, Post, Body, Put, Param, Delete, Get, UseGuards, Query, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}
  
 @UseGuards(AuthGuard('jwt'))
 @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
   @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
  return this.usersService.update(+id, dto);
  }
   @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
  return this.usersService.delete(+id);
  }
 @UseGuards(AuthGuard('jwt'))
@Get('all')
findAll(@Query('page') page = 1) {
  return this.usersService.findAll(Number(page));
}

 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('name') name?: string,
  @Query('email') email?: string,
  @Query('phone') phone?: string,
  @Query('role_id') roleId?: string,
  @Query('is_active') isActive?: string,
  @Query('created_at') createdAt?: string,
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
  return this.usersService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      name,
      email,
      phone,
      roleId,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      createdAt,
        location_id: parsedLocationId,
    },
    Number(page),
    Number(limit),
  );
}
//http://localhost:3000/users/filter?name=vaibhavi


//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.usersService.findOne(+id);
//   } 
//   @Get(':search')
// findOne(@Param('search') value: string) {
//   return this.usersService.findByIdOrNameOrEmail(value);
// }
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
    return this.usersService.searchWithPagination(body);
}  
 @UseGuards(AuthGuard('jwt'))
@Patch(':id/status')
  updateBranchStatus(@Param('id') id: string) {
    return this.usersService.updateStatus(+id);
}
 @UseGuards(AuthGuard('jwt'))
@Post('reset-password')
resetPassword(@Body() dto: ResetPasswordDto) {
  return this.usersService.resetPassword(dto);
}
 @UseGuards(AuthGuard('jwt'))
@Post('forgot-password')
async forgotPassword(@Body('email') email: string) {
  return this.usersService.forgotPassword(email);
}

}