import { forwardRef, Module } from '@nestjs/common';
import { ContactPersonController } from './contact_person.controller';
import { ContactPersonService } from './contact_person.service';
import { ContactPerson } from './entities/contact_per.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchModule } from 'src/branch/branch.module';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactPerson,User]),BranchModule,forwardRef(() => AuthModule),],
  controllers: [ContactPersonController],
  providers: [ContactPersonService],
  exports:[ContactPersonService]
})
export class ContactPersonModule {}
