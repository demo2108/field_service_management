// src/work_orders/entities/workorder-assign-to.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WorkOrder } from './work-order.entity';
import { User } from 'src/users/entities/user.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';

@Entity('workorder_assignto')
export class WorkOrderAssignTo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  work_order_id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.assignments)
  @JoinColumn({ name: 'work_order_id' })
  workOrder: WorkOrder;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

      @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;
}
