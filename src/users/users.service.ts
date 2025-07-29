import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocationMaster } from 'src/location_master/entities/location-master.entity';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';
import { randomBytes } from 'crypto';
import { MailService } from './mail.service';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';

// import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LocationMaster)
    private readonly locationRepository: Repository<LocationMaster>,
 private readonly mailService: MailService ,
 @InjectRepository(EventLog)
    private eventLogRepository: Repository<EventLog>,


  ) {}
// async create(dto: CreateUserDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: User | null;
// }> {
//   const existingUser = await this.userRepository.findOne({
//     where: { email: dto.email },
//   });

//   if (existingUser) {
//     return {
//       statusCode: 400,
//       message: 'Email already exists',
//       data: null,
//     };
//   }

//   const mobileNo = await this.userRepository.findOne({
//     where: { phone: dto.phone },
//   });

//   if (mobileNo) {
//     return {
//       statusCode: 400,
//       message: 'Mobile number already exists',
//       data: null,
//     };
//   }

//   const password_hash = await bcrypt.hash(dto.password, 10);

//   const user = this.userRepository.create({
//     ...dto,
//     password_hash,
//   });

//   const savedUser = await this.userRepository.save(user);

//   return {
//     statusCode: 201,
//     message: 'User created successfully',
//     data: savedUser,
//   };
// }
//main
// async create(dto: CreateUserDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: User | null;
// }> {
//   const existingUser = await this.userRepository.findOne({
//     where: { email: dto.email },
//   });
// if (!dto.created_by || typeof dto.created_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`created_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }

//   if (existingUser) {
//     return {
//       statusCode: 400,
//       message: 'Email already exists',
//       data: null,
//     };
//   }

//   const creator = await this.userRepository.findOne({
//     where: { id: dto.created_by },
//   });

//   if (!creator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${dto.created_by} (creator) not found.`,
//       data: null,
//     };
//   }

//   const mobileNo = await this.userRepository.findOne({
//     where: { phone: dto.phone },
//   });

//   if (mobileNo) {
//     return {
//       statusCode: 400,
//       message: 'Mobile number already exists',
//       data: null,
//     };
//   }

//   const password_hash = await bcrypt.hash(dto.password, 10);

//   const user = this.userRepository.create({
//     ...dto,
//     password_hash,
//     creator,
//   });

//   const savedUser = await this.userRepository.save(user);

//   // ✅ Load full user with related location details
//   const fullUser = await this.userRepository.findOne({
//     where: { id: savedUser.id },
//     relations: ['location','creator'], // Make sure 'location' is the correct relation name
//   });

//   return {
//     statusCode: 201,
//     message: 'User created successfully',
//     data: fullUser,
//   };
// }
async create(dto: CreateUserDto): Promise<{
    statusCode: number;
    message: string;
    data: User | null;
  }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!dto.created_by || typeof dto.created_by !== 'number') {
      return {
        statusCode: 400,
        message: '`created_by` is required and must be a valid numeric user ID.',
        data: null,
      };
    }

    if (existingUser) {
      return {
        statusCode: 400,
        message: 'Email already exists',
        data: null,
      };
    }

    const creator = await this.userRepository.findOne({
      where: { id: dto.created_by },
    });

    if (!creator) {
      return {
        statusCode: 404,
        message: `User with ID ${dto.created_by} (creator) not found.`,
        data: null,
      };
    }

    const mobileNo = await this.userRepository.findOne({
      where: { phone: dto.phone },
    });

    if (mobileNo) {
      return {
        statusCode: 400,
        message: 'Mobile number already exists',
        data: null,
      };
    }

    const password_hash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      ...dto,
      password_hash,
      creator,
    });

    const savedUser = await this.userRepository.save(user);

const fullUser = await this.userRepository.findOne({
  where: { id: savedUser.id },
  relations: ['location', 'creator'], // remove if relations don't work
});

if (!fullUser) {
  console.error('❌ Could not find saved user with ID', savedUser.id);
  return {
    statusCode: 500,
    message: 'Failed to load created user for logging.',
    data: null,
  };
}

// Strip password_hash without name conflict
const { password_hash: _ignore, ...safeUser } = fullUser;

// Convert to plain object
const plainSafeUser = JSON.parse(JSON.stringify(safeUser));

// Debug log
console.log('✅ About to store in remark:', plainSafeUser);

// Store in event_log
await this.eventLogRepository.save({
  eventName: 'USER_CREATED',
  userId: savedUser.id,
  changedBy: dto.created_by,
  locationTime: new Date(),
  status: 'CREATED',
       user_id: savedUser.id,     
  remark: plainSafeUser, // should be stored correctly now
});



    return {
      statusCode: 201,
      message: 'User created successfully',
      data: fullUser,
    };
  }
//main
// async update(
//   id: number,
//   dto: UpdateUserDto
// ): Promise<{
//   statusCode: number;
//   message: string;
//   data: User | null;
// }> {
//   const user = await this.userRepository.findOne({ where: { id } });

//   if (!dto.updated_by || typeof dto.updated_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`updated_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }

//   const updator = await this.userRepository.findOne({ where: { id: dto.updated_by } });
//   if (!updator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${dto.updated_by} not found`,
//       data: null,
//     };
//   }

//   if (!user) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${id} not found`,
//       data: null,
//     };
//   }

//   // 🔒 Check if email exists in other users (not the current one)
//   const existingUser = await this.userRepository.findOne({
//     where: {
//       email: dto.email,
//       id: Not(id), // ✅ exclude current user
//     },
//   });

//   if (existingUser) {
//     return {
//       statusCode: 400,
//       message: 'Email already exists for another user',
//       data: null,
//     };
//   }

//   // 🔒 Check if phone exists in other users (not the current one)
//   const mobileNo = await this.userRepository.findOne({
//     where: {
//       phone: dto.phone,
//       id: Not(id), // ✅ exclude current user
//     },
//   });

//   if (mobileNo) {
//     return {
//       statusCode: 400,
//       message: 'Mobile number already exists for another user',
//       data: null,
//     };
//   }

//   if (!dto.location_id || isNaN(Number(dto.location_id)) || dto.location_id <= 0) {
//     return {
//       statusCode: 400,
//       message: 'location_id is required and must be a positive number',
//       data: null,
//     };
//   }

//   let updatedFields: any = { ...dto };

//   if (dto.password) {
//     const password_hash = await bcrypt.hash(dto.password, 10);
//     updatedFields.password_hash = password_hash;
//     delete updatedFields.password;
//   }

//   Object.assign(user, updatedFields);
//   await this.userRepository.save(user);

//   const fullUser = await this.userRepository.findOne({
//     where: { id },
//     relations: ['location', 'updator'],
//   });

//   return {
//     statusCode: 200,
//     message: `User with ID ${id} updated successfully`,
//     data: fullUser,
//   };
// }
async update(
  id: number,
  dto: UpdateUserDto
): Promise<{
  statusCode: number;
  message: string;
  data: User | null;
}> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!dto.updated_by || typeof dto.updated_by !== 'number') {
    return {
      statusCode: 400,
      message: '`updated_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }

  const updator = await this.userRepository.findOne({ where: { id: dto.updated_by } });
  if (!updator) {
    return {
      statusCode: 404,
      message: `User with ID ${dto.updated_by} not found`,
      data: null,
    };
  }

  if (!user) {
    return {
      statusCode: 404,
      message: `User with ID ${id} not found`,
      data: null,
    };
  }

  const existingUser = await this.userRepository.findOne({
    where: {
      email: dto.email,
      id: Not(id),
    },
  });

  if (existingUser) {
    return {
      statusCode: 400,
      message: 'Email already exists for another user',
      data: null,
    };
  }

  const mobileNo = await this.userRepository.findOne({
    where: {
      phone: dto.phone,
      id: Not(id),
    },
  });

  if (mobileNo) {
    return {
      statusCode: 400,
      message: 'Mobile number already exists for another user',
      data: null,
    };
  }

  if (!dto.location_id || isNaN(Number(dto.location_id)) || dto.location_id <= 0) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be a positive number',
      data: null,
    };
  }

  let updatedFields: any = { ...dto };

  if (dto.password) {
    const password_hash = await bcrypt.hash(dto.password, 10);
    updatedFields.password_hash = password_hash;
    delete updatedFields.password;
  }

  Object.assign(user, updatedFields);
  await this.userRepository.save(user);

const fullUpdatedUser = await this.userRepository.findOne({
  where: { id },
  relations: ['location', 'updator'],
});

if (!fullUpdatedUser) {
  return {
    statusCode: 500,
    message: 'Failed to fetch updated user data for logging.',
    data: null,
  };
}

// Safely remove password_hash
const { password_hash: _ignore, ...userForLog } = fullUpdatedUser;

// Store in event log
await this.eventLogRepository.save({
  action: 'user_updated',
  entity: 'user',
  entity_id: id,
  performed_by: dto.updated_by,
  user_id: id,
  remark: userForLog,
  status: 'UPDATED',
  timestamp: new Date(),
});


  return {
    statusCode: 200,
    message: `User with ID ${id} updated successfully`,
    data: fullUpdatedUser,
  };
}



async delete(id: number): Promise<{ statusCode: number; message: string }> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  try {
    await this.userRepository.delete(id);

    return {
      statusCode: 200,
      message: `User with ID ${id} has been deleted successfully.`,
    };
  } catch (error: any) {
    if (error.code === '23503') {
      // Foreign key violation (e.g., user is linked to tasks, services, etc.)
      return {
        statusCode: 400,
        message: `User with ID ${id} cannot be deleted because it is linked to other records.`,
      };
    }

    throw error;
  }
}

async findAll(
  page = 1
): Promise<{
  statusCode: number;
  message: string;
  data: { users: User[]; total: number; page: number; totalPages: number };
}> {
  const take = 10;
  const skip = (page - 1) * take;

  const [users, total] = await this.userRepository.findAndCount({
    take,
    skip,
      relations: ['location'],
    order: { id: 'DESC' },
  });

  return {
    statusCode: 200,
    message: total > 0 ? 'Users retrieved successfully.' : 'No users found.',
    data: {
      users,
      total,
      page,
      totalPages: Math.ceil(total / take),
    },
  };
}

async findByFilters(
  filters: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    roleId?: string;
    isActive?: boolean;
    createdAt?: string; 
      location_id?:number;// e.g., '2025-06-10'
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
   if (!filters.location_id || isNaN(filters.location_id)) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be a valid number',
      data: {
        users: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  const query = this.userRepository.createQueryBuilder('user').leftJoinAndSelect('user.location', 'location')
   .leftJoinAndSelect('user.creator', 'creator')
    .leftJoinAndSelect('user.updator', 'updator');




  query.andWhere('user.location_id = :location_id', {
  location_id: filters.location_id,
});

  if (filters.id != null) {
    query.andWhere('user.id = :id', { id: filters.id });
  }

  if (filters.name != null) {
    query.andWhere('LOWER(user.name) LIKE LOWER(:name)', { name: `%${filters.name}%` });
  }

  if (filters.email != null) {
    query.andWhere('LOWER(user.email) LIKE LOWER(:email)', { email: `%${filters.email}%` });
  }

  if (filters.phone != null) {
    query.andWhere('user.phone LIKE :phone', { phone: `%${filters.phone}%` });
  }

  if (filters.roleId != null) {
    query.andWhere('user.roleId = :roleId', { roleId: filters.roleId });
  }

  if (filters.isActive != null) {
    query.andWhere('user.is_active = :isActive', { isActive: filters.isActive });
  }

  if (filters.createdAt != null) {
    query.andWhere('DATE(user.created_at) = :createdAt', { createdAt: filters.createdAt });
  }

  const [users, total] = await query
    .orderBy('user.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0
      ? 'Users filtered successfully.'
      : 'No users found matching the filters.',
    data: {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  // async findOne(id: number): Promise<User> {
  //   const user = await this.userRepository.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }

  //   return user;
  // }
  async findOne(
  id: number
): Promise<{
  statusCode: number;
  message: string;
  data: User | null;
}> {
  const user = await this.userRepository.findOne({ where: { id },  relations: ['location'], });

  if (!user) {
    return {
      statusCode: 404,
      message: `User with ID ${id} not found`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: `User with ID ${id} retrieved successfully`,
    data: user,
  };
}

async findByIdOrNameOrEmail(
  value: string
): Promise<{
  statusCode: number;
  message: string;
  data: User | null;
}> {
  const id = parseInt(value, 10);

  let user: User | null = null;

  if (!isNaN(id)) {
    user = await this.userRepository.findOne({ where: { id } ,  relations: ['location'],});
  }

  if (!user) {
    user = await this.userRepository.findOne({
      where: [{ email: value }, { name: value }],
    });
  }

  if (!user) {
    return {
      statusCode: 404,
      message: `User with ID, name, or email "${value}" not found`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: `User matched by ID, name, or email "${value}" retrieved successfully`,
    data: user,
  };
}



async findByEmail(email: string): Promise<User | null> {
  return this.userRepository.findOne({ where: { email } });
}

async validateUser(
  email: string,
  plainPassword: string
): Promise<{
  statusCode: number;
  message: string;
  data: Partial<User> | null;
}> {
  const user = await this.findByEmail(email);

  if (!user) {
    return {
      statusCode: 404,
      message: 'User not found',
      data: null,
    };
  }

  const isMatch = await bcrypt.compare(plainPassword, user.password_hash);

  if (!isMatch) {
    return {
      statusCode: 401,
      message: 'Invalid password',
      data: null,
    };
  }

  const { password_hash, ...result } = user;

  return {
    statusCode: 200,
    message: 'Login successful',
    data: result,
  };
}


async searchWithPagination(body: {
  Page: number;
  PageSize: number;
  StartDate?: string;
  EndDate?: string;
  Search?: string;
  BranchId?: number; 
   location_id?: number;// Kept for compatibility, not used in this method
}): Promise<{
  statusCode: number;
  message: string;
  data: {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const { Page, PageSize, StartDate, EndDate, Search, location_id } = body;
  const page = body.Page || 1;
  const limit = body.PageSize || 10;
  const skip = (page - 1) * limit;
  if (!location_id || location_id <= 0) {
    return {
      statusCode: 400,
      message: 'Location_id is required and must be a valid number',
      data: {
        users: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }
  const query = this.userRepository.createQueryBuilder('user').leftJoinAndSelect('user.location', 'location')
   .leftJoinAndSelect('user.creator', 'creator')
    .leftJoinAndSelect('user.updator', 'updator');

  // Search across name, email, and phone
  if (body.Search) {
    const keyword = `%${body.Search}%`;
    query.andWhere(
      `(LOWER(user.name) LIKE LOWER(:keyword) OR LOWER(user.email) LIKE LOWER(:keyword) OR user.phone LIKE :keyword)`,
      { keyword }
    );
  }
 if (location_id) {
    query.andWhere('location.id = :location_id', { location_id: location_id });
  }
  // Optional date filter
if (body.StartDate && body.EndDate) {
  const start = new Date(body.StartDate);
  const end = new Date(body.EndDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      statusCode: 400,
      message: 'Invalid StartDate or EndDate format',
      data: {
        users: [],
        total: 0,
        page: page,
        totalPages: 0,
      },
    };
  }

  query.andWhere('user.created_at BETWEEN :startDate AND :endDate', {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  });
}


  const [users, total] = await query
    .orderBy('user.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Search results found' : 'No matching users found',
    data: {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async updateStatus(
  id: number
): Promise<{
  statusCode: number;
  message: string;
  data: User | null;
}> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    return {
      statusCode: 404,
      message: `User with ID ${id} not found`,
      data: null,
    };
  }

  // Toggle status
  user.is_active = !user.is_active;

  const updated = await this.userRepository.save(user);

  return {
    statusCode: 200,
    message: `User with ID ${id} has been marked as ${updated.is_active ? 'Active' : 'Inactive'}`,
    data: updated,
  };
}
// Inside your UsersService class

async resetPassword(
  dto: ResetPasswordDto
): Promise<{
  statusCode: number;
  message: string;
  data: User | null;
}> {
  const user = await this.userRepository.findOne({ where: { email: dto.email } });

  if (!user) {
    return {
      statusCode: 404,
      message: `User with email ${dto.email} not found`,
      data: null,
    };
  }

  const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);
  user.password_hash = newHashedPassword;

  const updatedUser = await this.userRepository.save(user);

  return {
    statusCode: 200,
    message: 'Password has been reset successfully',
    data: updatedUser,
  };
}
// async forgotPassword(email: string): Promise<{ statusCode: number; message: string }> {
//   const user = await this.userRepository.findOne({ where: { email } });

//   if (!user) {
//     return { statusCode: 404, message: 'User with this email does not exist' };
//   }

//   // Generate reset token (or temporary password)
//   const tempPassword = randomBytes(4).toString('hex'); // Example: 8-char temporary password

//   // Hash and save the new password
//   const hashedPassword = await bcrypt.hash(tempPassword, 10);
//   user.password_hash = hashedPassword;
//   await this.userRepository.save(user);

//   // Send email
//   await this.mailService.sendMail(
//     user.email,
//     'Reset Password - YourAppName',
//     `Your temporary password is: ${tempPassword}`
//   );

//   return { statusCode: 200, message: 'Temporary password sent to your email' };
// }
async forgotPassword(email: string): Promise<any> {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) {
    return { statusCode: 404, message: 'User not found' };
  }

  const tempPassword = Math.random().toString(36).slice(-8); // Example temp password
  const hashed = await bcrypt.hash(tempPassword, 10);
  user.password_hash = hashed;
  await this.userRepository.save(user);

  await this.mailService.sendMail(
    user.email,
    'Password Reset',
    `Your temporary password is: ${tempPassword}`
  );

  return { statusCode: 200, message: 'Temporary password sent to your email' };
}

}
