// src/service-request/entities/service-assign-to.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { User } from 'src/users/entities/user.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';

@Entity('service_assignto')
export class ServiceAssignTo {
  @PrimaryGeneratedColumn()
  id: number;

//   @ManyToOne(() => ServiceRequest, (sr) => sr.assigned_engineers, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'service_request_id' })
//   service_request: ServiceRequest;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
    @ManyToOne(() => ServiceRequest, sr => sr.assigned_engineers, {
    onDelete: 'CASCADE',
  })
//   @JoinColumn({ name: 'service_request_id' })
//   service_request: ServiceRequest;
@ManyToOne(() => ServiceRequest, (sr) => sr.assigned_engineers, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'service_request_id' }) // 👈 this avoids the wrong "serviceRequestIdId"
service_request: ServiceRequest;

@Column()
service_request_id: number;

//   @Column({ nullable: true })
//   service_request_id: number;
//   @ManyToOne(() => ServiceRequest, sr => sr.assigned_engineers)
// @JoinColumn({ name: 'service_request_id' })
// service_request: ServiceRequest;

@ManyToOne(() => User)
@JoinColumn({ name: 'user_id' })
engineer: User;

    @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;

// @Column()
// work_order_id: number;

}
