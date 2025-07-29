// contact-person.entity.ts
import { Branch } from 'src/branch/entities/branch.entity';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, UpdateDateColumn } from 'typeorm';


@Entity('contact_person')
export class ContactPerson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.id, { onDelete: 'CASCADE' })
  branch: Branch;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100 })
  designation: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

        @ManyToOne(() => LocationMaster, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' }) 
  location?: LocationMaster;


   
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
