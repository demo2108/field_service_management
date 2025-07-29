import { Customer } from 'src/customer/entities/customer.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import {  Entity,  PrimaryGeneratedColumn,  Column,  CreateDateColumn,  ManyToOne,  JoinColumn, OneToMany, UpdateDateColumn,} from 'typeorm';


@Entity('branch')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'branch_name', type: 'varchar', length: 255, nullable: true })
  branch_name?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  pincode?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact_number?: string;

 @CreateDateColumn({ type: 'timestamp' })
   created_at: Date;
 
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

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
  
  @OneToMany(() => WorkOrder, (workOrder) => workOrder.branch)
workOrders: WorkOrder[];


@ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'location_id' }) // 👈 link to DB column
  location?: LocationMaster; // 👈 relation property
}
