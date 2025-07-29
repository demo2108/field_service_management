import { CustomerProduct } from 'src/customer_products/entities/customer-product.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { PartRequest } from 'src/part_requests/entities/part-request.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';


@Entity('service_request_summary')
export class ServiceRequestSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer_product_id: number;

  @ManyToOne(() => CustomerProduct)
  @JoinColumn({ name: 'customer_product_id' })
  customerProduct: CustomerProduct;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ default: false })
  repair: boolean;

  @Column({ nullable: true })
  part_id: number;

  @ManyToOne(() => PartRequest, { nullable: true })
  @JoinColumn({ name: 'part_id' })
  part: PartRequest;

      @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;
}
