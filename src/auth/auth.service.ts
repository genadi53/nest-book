import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginDto } from './dto/login.dto';
// import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hash,
          role: Role.User,
        },
      });
      return user;
    } catch (err) {
      console.error(err);
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials Taken');
      }
      throw Error(err);
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) throw new ForbiddenException('Incorrect credentials');

      const isMatch = await argon.verify(user.password, dto.password);
      if (!isMatch) throw new ForbiddenException('Incorrect credentials');

      return { user };
    } catch (err) {
      console.error(err);
      throw new ForbiddenException(err.message || 'Incorrect credentials');
    }
  }
}
