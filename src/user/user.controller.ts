import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UserService } from './user.service';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  getProfile(@GetUser() user: User | undefined) {
    console.log(user);
    return user;
  }

  @Get('/profile/email')
  getUserEmail(@GetUser('email') email: string | undefined) {
    return email;
  }

  @Patch('/edit')
  async editUser(
    @GetUser('id') id: number | undefined,
    @Body() dto: EditUserDto,
  ) {
    if (!id) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    return this.userService.editUser(id, dto);
  }
}
