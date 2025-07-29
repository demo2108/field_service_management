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
} from 'typeorm';
import { Attachment } from './attachment.entity';
// @Entity('signature_master')
// export class SignatureMaster {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   attachment_id: number;

//   @Column()
//   work_order_id: number;

//   @Column()
//   service_request_id: number;

//   @Column({ type: 'varchar', length: 255 })
//   signature_path: string;

//   @CreateDateColumn({ type: 'timestamp' })
//   created_at: Date;

//   @UpdateDateColumn({ type: 'timestamp' })
//   updated_at: Date;
//   @ManyToOne(() => Attachment, attachment => attachment.signatures, { onDelete: 'CASCADE' })
// @JoinColumn({ name: 'attachment_id' })
// attachment: Attachment;

// }
@Entity('signature_master')
export class SignatureMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attachment_id: number; // ✅ ADD THIS COLUMN DECORATOR

  @Column()
  work_order_id: number;

  @Column()
  service_request_id: number;

  @Column({ type: 'varchar', length: 255 })
  signature_path: string;

//   @Column({ nullable: true }) // ✅ Add this if you're passing it
//   created_by: number;

//   @Column({ nullable: true }) // Optional, if used
//   uploaded_by: number;

//   @Column({ nullable: true })
//   location_id: number;

//   @Column({ nullable: true, type: 'varchar', length: 500 })
//   document_name: string;

//   @Column({ nullable: true, type: 'varchar', length: 500 })
//   document_number: string;

//   @Column({ nullable: true, type: 'text' })
//   remarks: string;

//   @CreateDateColumn({ type: 'timestamp' })
//   created_at: Date;

//   @UpdateDateColumn({ type: 'timestamp' })
//   updated_at: Date;

  @ManyToOne(() => Attachment, attachment => attachment.signatures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attachment_id' })
  attachment: Attachment;
}


