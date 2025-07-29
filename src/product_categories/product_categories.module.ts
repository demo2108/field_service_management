import { forwardRef, Module } from '@nestjs/common';
import { ProductCategoriesController } from './product_categories.controller';
import { ProductCategoriesService } from './product_categories.service';
import { ProductCategory } from './entities/product-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory,LocationMaster,User]),forwardRef(() => AuthModule),],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
  exports:[ProductCategoriesService]
})
export class ProductCategoriesModule {}

 