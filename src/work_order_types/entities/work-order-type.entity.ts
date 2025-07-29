import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('work_order_types')
export class WorkOrderType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  capacity: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  height: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  width: string;

  @Column({ type: 'int', nullable: true, name: 'no_of_loadshell' })
  no_of_loadshell: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

    @ManyToOne(() => LocationMaster, { nullable: false }) // or true if optional
@JoinColumn({ name: 'location_id' })
location: LocationMaster;

@Column()
location_id: number;


   

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

   @Column({ type: 'interval', nullable: true })
  sla: string;

}
