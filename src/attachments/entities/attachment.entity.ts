import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { ServiceRequest } from 'src/service_request/entities/service-request.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SignatureMaster } from './signature_master.entity';
import { IsArray, IsString } from 'class-validator';

@Entity('attachments')
export class Attachment {

    @IsArray()
  @IsString({ each: true })
  base64_files: string[];
  @PrimaryGeneratedColumn()
  id: number;
  

  @Column({ nullable: true })
  work_order_id: number;
  @ManyToOne(() => WorkOrder)
  @JoinColumn({ name: 'work_order_id' })
  work_order: WorkOrder;


   @Column({ nullable: true })
  service_request_id: number;
  @ManyToOne(() => ServiceRequest)
  @JoinColumn({ name: 'service_request_id' })
  service_request: ServiceRequest;

  @Column({ nullable: true })
  uploaded_by: number;

  @Column({ type: 'text' })
  file_url: string;

@Column({ type: 'varchar', length: 100, nullable: true }) // or longer
file_type: string;

  @CreateDateColumn({ type: 'timestamp' })
  uploaded_at: Date;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  document_name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  document_number: string;

      @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
    @JoinColumn({ name: 'location_id' }) 
    location?: LocationMaster;

      @Column() // ✅ This is the missing piece if it's not working
  location_id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;
  
    @Column({ nullable: true })
    updated_by: number;
    @ManyToOne(() => User)
    @JoinColumn({ name: 'updated_by' })
    updator: User;

//  @Column({ nullable: true })
//     attechment_id: number;  

 
@Column()
created_by: number;
@OneToMany(() => SignatureMaster, signature => signature.attachment)
signatures: SignatureMaster[];



}
