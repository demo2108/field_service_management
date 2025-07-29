// import { forwardRef, Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { AuthModule } from 'src/auth/auth.module';
// import { UserroleController } from './userrole.controller';
// import { UserroleService } from './userrole.service';
// import { Role } from './entities/role.entity';
// @Module({
//   imports: [TypeOrmModule.forFeature([Role]),forwardRef(() => AuthModule),],
//   controllers: [UserroleController],
//   providers: [UserroleService],
//   exports: [UserroleService],
// })
// export class UserroleModule {}
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserroleController } from './userrole.controller';
import { UserroleService } from './userrole.service';
import { Role } from './entities/role.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserroleController],
  providers: [UserroleService],
  exports: [UserroleService],
})
export class UserroleModule {}
