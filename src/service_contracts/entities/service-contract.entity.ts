// src/service_contracts/entities/service-contract.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import { ServiceType } from 'src/service_types/entities/service-type.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import { AppDirectory } from 'src/app_directory/entities/app_directory.entity';
import { IsInt, IsOptional } from 'class-validator';

@Entity('service_contracts')
export class ServiceContract {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  work_order_id: number;

  @ManyToOne(() => WorkOrder)
  @JoinColumn({ name: 'work_order_id' })
  work_order: WorkOrder;
  
  @ManyToOne(() => ServiceType)
  @JoinColumn({ name: 'service_type_id' })
  service_type: ServiceType;

  // @Column({ type: 'varchar', length: 50, nullable: true })
  // contractType: string

    @Column({ type: 'varchar', length: 50, nullable: true })
contract_number: string
  // @ManyToOne(() => ServiceType)
  // @JoinColumn({ name: 'service_type_id' })
  // service_type: ServiceType;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => LocationMaster, { nullable: false }) 
@JoinColumn({ name: 'location_id' })
location: LocationMaster;

@Column()
location_id: number;

// @Column()
// contract_type_id: number;
@ManyToOne(() => AppDirectory, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'contract_type_id' })
contract_type: AppDirectory;

 
   @UpdateDateColumn({ type: 'timestamp' })
   updated_at: Date;
   
@IsOptional()
@IsInt()
contract_type_id?: number;
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
