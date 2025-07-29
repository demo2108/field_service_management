import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  type_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  model_number: string;

    @Column({ type: 'varchar', length: 100 })
  unit: string;

  // @Column({ name: 'serial_no', type: 'varchar', length: 100 })
  // serial_no: string;
  
  @Column({ type: 'date', nullable: true })
  expiry_date: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

    @Column({ type: 'boolean', default: true })
  is_product: boolean;
  @Column({ type: 'int', nullable: true })
  replacement_of: number;

  @CreateDateColumn({ type: 'timestamp' })
  added_at: Date;

  @Column({ type: 'text', array: true, nullable: true })
  club_code: string[];

 @Column({ type: 'int', array: true, nullable: true })
  work_order_type: number[]; 
  
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
     @Column({ type: 'varchar', length: 100 })
  make: string;
   @Column({ type: 'varchar', length: 100 })
  contract_type: string;
   @Column({ type: 'varchar', length: 100 })
  duration: string;
     @Column({ type: 'varchar', length: 100 })
  product_code: string;
@ManyToOne(() => LocationMaster, { nullable: false }) // or true if optional
@JoinColumn({ name: 'location_id' })
location: LocationMaster;

@Column()
location_id: number;

//  @CreateDateColumn({ type: 'timestamp' })
//    created_at: Date;

   

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