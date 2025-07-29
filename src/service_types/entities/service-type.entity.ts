import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('service_types')
export class ServiceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // @Column({ type: 'int', nullable: true })
  // created_by?: number;

  // @Column({ type: 'int', nullable: true })
  // updated_by?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

      @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;

  // @CreateDateColumn({ type: 'timestamp' })
  //    created_at: Date;
   
  //    @UpdateDateColumn({ type: 'timestamp' })
  //    updated_at: Date;
     
  
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
