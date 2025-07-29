import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity({ name: 'schedule_config' })
export class ScheduleConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  schedule_type: string;

  @Column()
  step: string;

  @Column()
  mail_to: string;

  @Column({ nullable: true })
  mail_subject: string;

  @Column({ type: 'text', nullable: true })
  mail_body: string;

@ManyToOne(() => User, { nullable: true })
@JoinColumn({ name: 'created_by' })
created_by: User;

@ManyToOne(() => User, { nullable: true })
@JoinColumn({ name: 'updated_by' })
updated_by: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

    @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;


   @ManyToOne(() => User)
   @JoinColumn({ name: 'updated_by' })
   updator: User;
}
