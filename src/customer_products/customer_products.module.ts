import { forwardRef, Module } from '@nestjs/common';
import { CustomerProductsController } from './customer_products.controller';
import { CustomerProductsService } from './customer_products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerProduct } from './entities/customer-product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Product } from 'src/product/entities/product.entity';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerProduct, Product,WorkOrder,User]),forwardRef(() => AuthModule),],
  controllers: [CustomerProductsController],
  providers: [CustomerProductsService],
    exports: [CustomerProductsService],
})

export class CustomerProductsModule {}
 

