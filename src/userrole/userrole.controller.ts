// import { Controller, Get } from '@nestjs/common';
// import { UserroleService } from './userrole.service';
// import { AuthService } from 'src/auth/auth.service';

// @Controller('userrole')
// export class UserroleController {
//     constructor(private readonly userroleService: UserroleService,
//         private readonly authService: AuthService
//       ) {}
    
//    @Get()
//   findAll() {
//     return this.userroleService.findAll();
//   }
// }
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserroleService } from './userrole.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('userrole')
export class UserroleController {
  constructor(
    private readonly userroleService: UserroleService
  ) {}
//   @UseGuards(JwtAuthGuard)
  // @Get()
  // findAll() {
  //   return this.userroleService.findAll();
  // }
 @UseGuards(AuthGuard('jwt'))
@Get('all')
findAll(@Query('page') page = 1) {
  return this.userroleService.findAll(Number(page));
}
 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('rolename') rolename?: string,
  @Query('permissionid') permissionid?: string,
  @Query('createdby') createdby?: string,
  @Query('createdat') createdat?: string,
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
  return this.userroleService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      rolename,
      permissionid: permissionid ? Number(permissionid) : undefined,
      createdby,
      createdat,
    },
    Number(page),
    Number(limit),
  );
}
//http://localhost:3000/userrole/filter?rolename=admin
}
