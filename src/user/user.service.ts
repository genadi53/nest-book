import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, userData: EditUserDto) {
    try {
      console.log(userId);
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...userData,
        },
      });
      console.log(user);

      return { user };
    } catch (err) {
      console.error(err);
      if (typeof err === typeof HttpException) {
        return new HttpException(err.message, err.getStatus());
      }
      return new HttpException('I_AM_A_TEAPOT', HttpStatus.I_AM_A_TEAPOT);
    }
  }

  async getProfile(userId: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: { books: true },
    });
  }
}
