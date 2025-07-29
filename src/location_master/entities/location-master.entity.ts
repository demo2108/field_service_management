import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('location_master')
export class LocationMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  location_code: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact_no?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  website_name?: string;


 
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
