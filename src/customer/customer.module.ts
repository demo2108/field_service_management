import { forwardRef, Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerProduct } from 'src/customer_products/entities/customer-product.entity';
import { User } from 'src/users/entities/user.entity';

@Module({

 imports: [TypeOrmModule.forFeature([Customer,CustomerProduct,User]), forwardRef(() => AuthModule)],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService, TypeOrmModule]})  // Export the TypeOrmModule here!
export class CustomerModule {}
