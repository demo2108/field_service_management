import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { WorkOrder } from "./work-order.entity";
import { TaskAssignment } from "./task_assignments.entity";
import { User } from "src/users/entities/user.entity";
import { Customer } from "src/customer/entities/customer.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { LocationMaster } from "src/location_master/entities/location-master.entity";

@Entity('work_order_tasks')
export class WorkOrderTask {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  title: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  work_order_id: number;
  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => WorkOrder, workOrder => workOrder.tasks)
  @JoinColumn({ name: 'work_order_id' })
  work_order: WorkOrder;

  @OneToMany(() => TaskAssignment, assign => assign.task, { cascade: true })
  assignments: TaskAssignment[];


  @UpdateDateColumn({ type: 'timestamp' })
updated_at: Date;

// @ManyToOne(() => Customer, { eager: true })
// @JoinColumn({ name: 'customer_id' })
// customer: Customer;

// @ManyToOne(() => Branch, { eager: true })
// @JoinColumn({ name: 'branch_id' })
// branch: Branch;
    @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;

  @CreateDateColumn({ type: 'timestamp' })
     created_at: Date;
   
    //  @UpdateDateColumn({ type: 'timestamp' })
    //  updated_at: Date;
     
  
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
