// task-assignment.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { WorkOrderTask } from './work_order_tasks.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';

@Entity('task_assignments')
export class TaskAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkOrderTask, task => task.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: WorkOrderTask;

  @ManyToOne(() => User, user => user.assigned_tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

      @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;
}
     