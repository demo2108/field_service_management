import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mail_configs')
export class MailConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mail_driver: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  mail_host: string;

  @Column({ type: 'int', nullable: true })
  mail_port: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  mail_username: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  mail_password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mail_address: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  mail_encryption: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mail_active: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'varchar', length: 100 })
  mail_name: string;
}
