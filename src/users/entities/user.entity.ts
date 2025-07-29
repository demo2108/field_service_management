// src/users/entities/user.entity.ts
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { ServiceAssignTo } from 'src/service_request/entities/service-assign-to.entity';
import { ServiceRequest } from 'src/service_request/entities/service-request.entity';
import { TaskAssignment } from 'src/work_orders/entities/task_assignments.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, OneToMany, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;
  @OneToMany(() => TaskAssignment, assignment => assignment.user)
  assigned_tasks: TaskAssignment[];
  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text' })
  password_hash: string;

  // @Column({ name: 'role_id', length: 50 })
  // roleId: string;
  @Column({ name: 'role_id', type: 'int' })
roleId: number;

  // @OneToMany(() => ServiceAssignTo, (assign) => assign.user)
  // assignedRequests: ServiceAssignTo[];
  //   assigned_tasks: any;
    @Column({ type: 'boolean', default: true })
  is_active: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;


    @ManyToOne(() => LocationMaster, { nullable: false }) // or true if optional
@JoinColumn({ name: 'location_id' })
location: LocationMaster;

@Column()
location_id: number;


 
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
