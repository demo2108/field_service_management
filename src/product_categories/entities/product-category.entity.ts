import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('product_categories')
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  club_code: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'boolean', default: true })
is_active: boolean;

@Column({ type: 'varchar', length: 255, nullable: true })
description?: string;

   @ManyToOne(() => LocationMaster, { nullable: false }) // or true if optional
@JoinColumn({ name: 'location_id' })
location: LocationMaster;

@Column()
location_id: number;

// 
   

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
