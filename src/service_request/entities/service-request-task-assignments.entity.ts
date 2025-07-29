// task-assignment.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { ServiceRequestTask } from './service-request-task.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';


@Entity('task_assignments_service_request')
export class ServiceRequestTaskAssignment {
  @PrimaryGeneratedColumn() 
  id: number;

  @ManyToOne(() => ServiceRequestTask, task => task.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: ServiceRequestTask;

  @ManyToOne(() => User, user => user.assigned_tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;
}
      