import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('user_role') // Table name in DB
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  rolename: string;

  @Column({ type: 'int', nullable: true })
  permissionid: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  createdby: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdat: Date;

      @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;
}
