import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,
    private usersService:UsersService
  ) {}

//   async validateUser(id: number, password_hash: string): Promise<any> {
//     const user = await this.usersService.findOne(id);
  
//     if (user && await bcrypt.compare(password_hash, user.password_hash)) {
//       const { password_hash, ...result } = user;
//       return result;
//     }
//     return null;
//   }


  async validateUser(email: string, password: string): Promise<any> {
const user = await this.usersService.findByEmail(email);

  if (user && await bcrypt.compare(password, user.password_hash)) {
    const { password_hash, ...result } = user;
    return result;
  }
  return null;
}

// async validateUser(email: string, password: string): Promise<any> {
//   const user = await this.usersService.findByEmail(email);

//   if (user && password === user.password_hash) { // no bcrypt
//     const { password_hash, ...result } = user;
//     return result;
//   }
//   return null;
// }


  // async login(user: any) {
  //   const payload = { email: user.email, sub: user.id };
   
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
  async login(user: any) {
  const payload = { email: user.email, sub: user.id };

  const { password, ...safeUser } = user;

  return {
    access_token: this.jwtService.sign(payload),
    user: safeUser,
  };
}

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    // TODO: Send email with the reset link (e.g., `https://yourapp.com/reset-password?token=${token}`)
    console.log(`token=${token}`);

    return { message: 'Reset link has been sent to your email' };
  }

  // async resetPassword(token: string, newPassword: string) {
  //   try {
  //     const decoded = this.jwtService.verify(token);
  //     const user = await this.usersService.findOne(decoded.sub);

  //     if (!user) throw new NotFoundException('User not found');

  //     const hashedPassword = await bcrypt.hash(newPassword, 10);
  //     user.password_hash = hashedPassword;

  //     await this.usersService.update(user.id, user);

  //     return { message: 'Password successfully updated' };
  //   } catch (error) {
  //     throw new BadRequestException('Invalid or expired token');
  //   }
  // }
// async resetPassword(token: string, newPassword: string) {
//   try {
//     const decoded = this.jwtService.verify(token);
//     const result = await this.usersService.findOne(decoded.sub);
//     const user = result.data;

//     if (!user) throw new NotFoundException('User not found');

//     // Use update method that already handles password hashing
//     await this.usersService.update(user.id, { password: newPassword });

//     return { message: 'Password successfully updated' };
//   } catch (error) {
//     throw new BadRequestException('Invalid or expired token');
//   }
// }

async resetPassword(email: string, newPassword: string) {
  const user = await this.usersService.findByEmail(email);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  await this.usersService.update(user.id, { password: newPassword });

  return { message: 'Password successfully updated' };
}

//   async save(user: User): Promise<User> {
//   return this.userRepository.save(user);
}

  
// }
