
// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   CreateDateColumn,
//   UpdateDateColumn,
//   JoinColumn,
// } from 'typeorm';

// @Entity('work_orders')
// export class WorkOrder {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'int' })
//   customer_id: number;

//   @Column({ type: 'int' })
//   branch_id: number;

//     @Column({ unique: true })
//   workOrderID: string; // new unique ID like WO-uuid

//   @Column({ type: 'varchar', length: 50 })
//   priority: string; // e.g., High, Medium, Low

//   @Column({ type: 'varchar', length: 50 })
//   status: string;

//   @Column({ type: 'text', nullable: true })
//   hold_reason: string;


//     @Column({ type: 'text', nullable: true })
//   for: string;


//     @Column({ type: 'text', nullable: true })
//   contact_person: string;

//     @Column({ type: 'text', nullable: true })
//   contact_person_no: string;

//   @Column({ type: 'text', nullable: true })
//   description: string;

//   @Column({ type: 'date', nullable: true })
//   target_completion_date: Date;

//   @Column({ type: 'int', nullable: true })
//   created_by: number;

//   @CreateDateColumn({ type: 'timestamp' })
//   created_at: Date;

//   @UpdateDateColumn({ type: 'timestamp' })
//   updated_at: Date;
// }
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkOrderAssignTo } from './workorder_assignto.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { User } from 'src/users/entities/user.entity';
import { TaskAssignment } from './task_assignments.entity';
import { WorkOrderTask } from './work_order_tasks.entity';
import { ServiceContract } from 'src/service_contracts/entities/service-contract.entity';
import { CustomerProduct } from 'src/customer_products/entities/customer-product.entity';
import { WorkOrderType } from 'src/work_order_types/entities/work-order-type.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Branch, { eager: true })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  // @Column({ type: 'varchar', length: 50, unique: true })
  // workorder_id: string;
  // @OneToMany(() => WorkOrderAssignTo, (assign) => assign.workOrder, {
  //   cascade: true,
  // })
  // assignments: WorkOrderAssignTo[];


  @Column({ type: 'varchar', length: 50, unique: true })
  workorder_id: string;
  
  @OneToMany(() => TaskAssignment, (assign) => assign.user, {
    cascade: true,
  })
  assignments: TaskAssignment[];

  @Column({ type: 'varchar', length: 50 })
  priority: string; // High, Medium, Low

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'text', nullable: true })
  hold_reason: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  target_completion_date: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contact_person_no: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contact_person: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  for: string; // "for" is not recommended as a property name, but quoted in SQL is okay

  @OneToMany(() => WorkOrderTask, (task) => task.work_order, { cascade: true })
  tasks: WorkOrderTask[];

  @OneToMany(() => ServiceContract, contract => contract.work_order)
  service_contracts: ServiceContract[];

  @OneToMany(() => CustomerProduct, cp => cp.work_order)
  customer_products: CustomerProduct[];

  @ManyToOne(() => WorkOrderType)
  @JoinColumn({ name: 'work_order_type_id' })
   work_order_type: WorkOrderType;

   @Column({ nullable: true })
   work_order_type_id: number;

   @Column({ type: 'boolean', default: true })
is_active: boolean;


  @Column({ type: 'int', nullable: true })
  no_of_items: number;

       @ManyToOne(() => LocationMaster, { nullable: false }) // or true if optional
@JoinColumn({ name: 'location_id' })
location: LocationMaster;

@Column()
location_id: number;


// @CreateDateColumn({ type: 'timestamp' })
//    created_at: Date;
 
//    @UpdateDateColumn({ type: 'timestamp' })
//    updated_at: Date;
   

//       //@Column({ nullable: true })
//    created_by: number;
//    @ManyToOne(() => User)
//    @JoinColumn({ name: 'created_by' })
//    creator: User;
 
   @Column({ nullable: true })
   updated_by: number;
   @ManyToOne(() => User)
   @JoinColumn({ name: 'updated_by' })
   updator: User;
   
}
