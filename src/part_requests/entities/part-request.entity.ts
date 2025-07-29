import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';


@Entity('part_requests')
export class PartRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  work_order_id: number;

  @ManyToOne(() => WorkOrder, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'work_order_id' })
  workOrder: WorkOrder;

 @Column({ nullable: true })
engineer_id: number;

@ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'engineer_id' }) // 👈 important: name must match column
engineer: User;

  // @ManyToOne(() => User, { nullable: true })
  // @JoinColumn({ name: 'engineer_id' })
  // engineer: User;

  @Column({ type: 'varchar', length: 255 })
  part_name: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar', length: 20, default: 'Pending' })
  request_status: string;

  @Column({ nullable: true })
  approved_by: number;

  // @ManyToOne(() => User, { nullable: true })
  // @JoinColumn({ name: 'approved_by' })
  // approvedBy: User;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  request_date: string;

  @Column({ type: 'date', nullable: true })
  approval_date: string;

      @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;

  @Column({ nullable: true })
  product_id: number;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product?: Product;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status?: string;

  @Column({ type: 'boolean', default: false })
  is_approved: boolean;

  @Column({ type: 'text', nullable: true })
  image_path?: string;

  // @Column({ nullable: true })
  // created_by: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  // @Column({ nullable: true })
  // updated_by: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by' })
  updatedBy?: User;

  // @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // created_at: Date;

  // @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // updated_at: Date;


  @CreateDateColumn({ type: 'timestamp' })
   created_at: Date;
 
   @UpdateDateColumn({ type: 'timestamp' })
   updated_at: Date;
   

      //@Column({ nullable: true })
  @Column({ nullable: true })
created_by: number;

@ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'created_by' }) // 👈 must match column name
creator: User;
 
   @Column()
   updated_by: number;
   @ManyToOne(() => User)
   @JoinColumn({ name: 'updated_by' })
   updator: User;

   
}
