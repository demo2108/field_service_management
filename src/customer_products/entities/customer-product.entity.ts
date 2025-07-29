import { Customer } from 'src/customer/entities/customer.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customer_products')
@Unique(['serial_no']) 
export class CustomerProduct {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Customer, customer => customer.customerProducts, { nullable: true })
  // @JoinColumn({ name: 'customer_id' })
  // customer: Customer;
@ManyToOne(() => Customer, { nullable: true }) // allow null
@JoinColumn({ name: 'customer_id' })
customer: Customer;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'date', nullable: true })
  delivery_date: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'installed_by' })
  installed_by: User;

  @Column({ type: 'date', nullable: true })
  expiry_date: Date;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'varchar', length: 100, unique: true }) 
  serial_no: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ManyToOne(() => WorkOrder, { nullable: true })
  @JoinColumn({ name: 'work_order_id' })
  work_order: WorkOrder;

  @Column({ type: 'timestamp', nullable: true })
  is_active_date: Date;

  @Column({ type: 'int', nullable: true })
  no_of_items: number;

  @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;


   
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
     
  created_by: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;
   
  @Column({ nullable: true })
  updated_by: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updator: User;
  
}
