import { CustomerProduct } from 'src/customer_products/entities/customer-product.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_person?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  company_code?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => WorkOrder, (workOrder) => workOrder.customer)
workOrders: WorkOrder[];
  @OneToMany(() => CustomerProduct, (cp) => cp.customer)
  customerProducts: CustomerProduct[];

      @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;



   
     @UpdateDateColumn({ type: 'timestamp' })
     updated_at: Date;
     
  
        //@Column({ nullable: true })
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
