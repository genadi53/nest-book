import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@GetUser() user: User | undefined) {
    console.log(user);
    return user;
  }

  @Get('/profile/email')
  getUserEmail(@GetUser('email') email: string | undefined) {
    return email;
  }
}
