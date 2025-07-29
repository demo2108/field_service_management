import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('event_log')
export class EventLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  event_name: string;

  @Column()
  work_order_id: number;

  @Column({ nullable: true })
  service_request_id: number;

  @Column({ nullable: true })
  service_request_task_id: number;

 @Column({ nullable: true })
  attachment_id: number;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'timestamp', nullable: true })
  location_time: Date;

  @Column({ length: 50, nullable: true })
  status: string;

@Column({ type: 'text', nullable: true })
reason?: string;

  @CreateDateColumn({ type: 'timestamp' })
  changed_at: Date;

  @Column({ nullable: true })
  changed_by: number;

  @Column({ type: 'date', nullable: true })
  existing_date: Date;

  @Column({ type: 'date', nullable: true })
  extending_date: Date;

  @Column({ nullable: true })
  user_id: number;
@Column({ nullable: true })
product_id: number;
@Column({ nullable: true })
work_order_task_id: number;
  @Column({ nullable: true })
  service_contract_id: number;
   @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  entry_time: Date;


  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  exit_time: Date;

    @Column({ type: 'jsonb', nullable: true })
  remark: object;
}
