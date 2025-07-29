import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ServiceRequest } from "./service-request.entity";
import { ServiceRequestTaskAssignment } from "./service-request-task-assignments.entity";
import { LocationMaster } from "src/location_master/entities/location-master.entity";
import { User } from "src/users/entities/user.entity";

@Entity('service_request_task')
export class ServiceRequestTask {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => ServiceRequest, serviceRequest => serviceRequest.tasks)
    @JoinColumn({ name: 'service_request_id' })
    service_request: ServiceRequest;


    
@Column({ nullable: true })
service_request_id: number;
    @OneToMany(() => ServiceRequestTaskAssignment, assign => assign.task, { cascade: true })
    assignments: ServiceRequestTaskAssignment[];

    @Column({ nullable: true })
location_id: number;
      @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;

   @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ length: 50, nullable: true })
  status: string;

  // @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'created_by' })
  // created_by_user?: User;

  // @Column({ nullable: true })
  // created_by: number;

  // @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'updated_by' })
  // updated_by_user?: User;

  // @Column({ nullable: true })
  // updated_by: number;

//   @CreateDateColumn({ type: 'timestamp' })
// created_at: Date;
//   @UpdateDateColumn({ type: 'timestamp' })
// updated_at: Date;
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



}
