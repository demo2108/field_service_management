// src/service-request/entities/service-request.entity.ts
import { ServiceType } from 'src/service_types/entities/service-type.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceAssignTo } from './service-assign-to.entity';
import { ServiceRequestTask } from './service-request-task.entity';
import { ServiceRequestTaskAssignment } from './service-request-task-assignments.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { AppDirectory } from 'src/app_directory/entities/app_directory.entity';
import { ServiceContract } from 'src/service_contracts/entities/service-contract.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { WorkOrderType } from 'src/work_order_types/entities/work-order-type.entity';


@Entity('service_request')
export class ServiceRequest {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => ServiceAssignTo, assign => assign.service_request, {
    cascade: true,
    eager: true,
  })
  assigned_engineers: ServiceAssignTo[];
  @ManyToOne(() => WorkOrder)
  @JoinColumn({ name: 'work_order_id' })
  work_order: WorkOrder;

  @ManyToOne(() => ServiceType)
  @JoinColumn({ name: 'service_name_id' })
  service_type: ServiceType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ nullable: true })
  updated_by: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updator: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ default: false })
  acknowledged: boolean;

  @Column({ type: 'timestamp', nullable: true })
  acknowledged_at: Date;

  @Column({ length: 50, nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  unavailability_reason: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  is_active: boolean;

   @Column({ default: true })
   wo_flag: boolean;

  @Column({ length: 50, nullable: true })
  priority: string;

  @Column({ nullable: true })
  sequence: number;

  @Column({ type: 'text', nullable: true })
  customer_feedback: string;

  @Column({ name: 'customer_signature_path', nullable: true })
  customer_signature_path: string;

  @OneToMany(() => ServiceRequestTask, (task) => task.service_request, { cascade: true })
  tasks: ServiceRequestTask[];

  @OneToMany(() => ServiceRequestTaskAssignment, (assign) => assign.user, {
      cascade: true,
  })
  assignments: ServiceRequestTaskAssignment[];

  @CreateDateColumn({ type: 'timestamp' })
  target_completion_date: Date;

  @CreateDateColumn({ type: 'timestamp' })
  starting_date: Date;

@ManyToOne(() => LocationMaster, { eager: false })
@JoinColumn({ name: 'location_id' })
location: LocationMaster;

@Column({ nullable: false })
location_id: number;
@ManyToOne(() => AppDirectory, { nullable: true })
@JoinColumn({ name: 'app_dir_id' })
contract_type: AppDirectory;

@Column({ nullable: true })
app_dir_id: number;

@Column({ nullable: true, length: 50 })
service_request_num?: string;

@Column({ nullable: true, length: 50 })
progress?: string;

@Column({ type: 'int', nullable: true })
work_order_id: number;

// @OneToMany(() => ServiceAssignTo, (assign) => assign.service_request, {
//   cascade: true,
//   eager: false,
// })
// assigned_engineers: ServiceAssignTo[];

//  @ManyToOne(() => ServiceContract, { nullable: true })
//   @JoinColumn({ name: 'contract_type_id' })
//   contract: ServiceContract;

//   @Column({ nullable: true })
//   contract_type_id: number;


@Column({ nullable: true })
customer_id?: number;

@Column({ nullable: true })
branch_id?: number;

@Column({ nullable: true })
 work_order_type_id?: number;




@ManyToOne(() => Customer, { eager: false })
@JoinColumn({ name: 'customer_id' })
customer: Customer;

@ManyToOne(() => Branch, { eager: false })
@JoinColumn({ name: 'branch_id' })
branch: Branch;

@ManyToOne(() => WorkOrderType, { eager: false })
@JoinColumn({ name: 'work_order_type_id' })
work_order_type: WorkOrderType;


@Column({ nullable: true, default: false })
charge?: boolean;

@Column({ nullable: true, length: 50 })
contact_person_no?: string;

@Column({ nullable: true, length: 255 })
contact_person?: string;

}
